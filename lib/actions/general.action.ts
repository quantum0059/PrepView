'use server'
import { feedbackSchema } from "@/constants";
import { db, auth } from "@/firebase/admin";
import {generateObject} from 'ai';
import { google } from "@ai-sdk/google";
export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null>{
    if (!userId) return null;
    const interviews = await db.collection('interviews')
                               .where('userId', '==', userId)
                               .orderBy('createdAt', 'desc')
                               .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null>{
    const {userId, limit = 20} = params;
    if (!userId) return null;
    
    const interviews = await db.collection('interviews')
                               .orderBy('createdAt', 'desc')
                               .where('finalized', '==', true)
                               .where('userId', '!=', userId)
                               .limit(limit)
                               .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview| null>{
    const interviewDoc = await db.collection('interviews')
                               .doc(id).get();

    if(!interviewDoc.exists){
        return null;
    }

    return {
        id: interviewDoc.id,
        ...interviewDoc.data()
    } as Interview;
}

export async function createFeedback(params: CreateFeedbackParams){
    const {interviewId, userId, transcript} = params;

    try{
      const formattedTranscript = transcript
            .map((sentence: {role: string, content: string})=> (
                `-${sentence.role}: ${sentence.content}\n`
            )).join('');

        const {object} = await generateObject({
            model: google('gemini-2.5-flash', {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt: `
                You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
                Transcript:
                ${formattedTranscript}

                Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
                - **Communication Skills**: Clarity, articulation, structured responses.
                - **Technical Knowledge**: Understanding of key concepts for the role.
                - **Problem-Solving**: Ability to analyze problems and propose solutions.
                - **Cultural & Role Fit**: Alignment with company values and job role.
                - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
            system: "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",

        });

        const feedback = await db.collection('feedback').add({
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),

        })

        return {
            success: true,
            feedbackId:feedback.id
        }
    }catch(e){
         console.error('Error saving feedback', e);
         return { success: false };
    }
}

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null>{
    const {interviewId, userId } = params;
    
    const feedback = await db.collection('feedback')
                               .where('interviewId', '==', interviewId)
                               .where('userId', '==', userId)
                               .limit(1)
                               .get();
    if(feedback.empty){
       return null;
    }
    
    const feedbackDoc = feedback.docs[0];

    return {
        id: feedbackDoc.id, ...feedbackDoc.data()
    } as Feedback;
}

export async function retakeInterview(params: {interviewId: string; userId: string}){
    const {interviewId, userId} = params;

    try {
        const feedbackSnap = await db.collection("feedback")
                                 .where("interviewId", "==", interviewId)
                                 .where("userId", "==", userId)
                                 .get();
        const batch = db.batch();
        feedbackSnap.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();

        return{
            success: true,
        };
    } catch (e) {
        console.error("retakeInterview error:", e);
        return { success: false };
    }
}

export async function getUserFeedbacks(userId: string): Promise<Feedback[]>{
    const feedbacks = await db.collection('feedback')
                               .where('userId', '==', userId)
                               .get();

    // Sort in memory instead of using orderBy to avoid index requirement
    const feedbacksArray = feedbacks.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Feedback[];
    
    // Sort by createdAt descending (newest first)
    return feedbacksArray.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // descending order
    });
}

export async function getUserProfileScores(userId: string) {
    const feedbacks = await getUserFeedbacks(userId);
    
    if (feedbacks.length === 0) {
        return {
            technicalKnowledge: 0,
            communicationSkills: 0,
            problemSolving: 0,
            confidenceClarity: 0,
        };
    }

    // Initialize accumulators
    const categoryTotals: Record<string, { sum: number; count: number }> = {};
    
    // Sum up all scores for each category
    feedbacks.forEach(feedback => {
        feedback.categoryScores.forEach(category => {
            const categoryName = category.name;
            if (!categoryTotals[categoryName]) {
                categoryTotals[categoryName] = { sum: 0, count: 0 };
            }
            categoryTotals[categoryName].sum += category.score;
            categoryTotals[categoryName].count += 1;
        });
    });

    // Calculate averages
    return {
        technicalKnowledge: Math.round(
            (categoryTotals['Technical Knowledge']?.sum || 0) / 
            (categoryTotals['Technical Knowledge']?.count || 1)
        ),
        communicationSkills: Math.round(
            (categoryTotals['Communication Skills']?.sum || 0) / 
            (categoryTotals['Communication Skills']?.count || 1)
        ),
        problemSolving: Math.round(
            (categoryTotals['Problem Solving']?.sum || 0) / 
            (categoryTotals['Problem Solving']?.count || 1)
        ),
        confidenceClarity: Math.round(
            (categoryTotals['Confidence and Clarity']?.sum || 0) / 
            (categoryTotals['Confidence and Clarity']?.count || 1)
        ),
    };
}

export async function getUserActivityData(userId: string) {
    const feedbacks = await getUserFeedbacks(userId);
    
    // Create a map of dates to activity count
    const activityMap: Record<string, number> = {};
    
    feedbacks.forEach(feedback => {
        const date = new Date(feedback.createdAt);
        // Format as YYYY-MM-DD for consistent key
        const dateKey = date.toISOString().split('T')[0];
        activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
    });
    
    return activityMap;
}

export async function getRecentInterviewTopics(userId: string, limit: number = 5) {
    const feedbacks = await getUserFeedbacks(userId);
    const interviews = await getInterviewsByUserId(userId);
    
    if (!interviews || feedbacks.length === 0) {
        return [];
    }
    
    // Create a map of interviewId to interview data
    const interviewMap = new Map(interviews.map(interview => [interview.id, interview]));
    
    // Get recent feedbacks with their interview data
    const recentTopics = feedbacks.slice(0, limit).map(feedback => {
        const interview = interviewMap.get(feedback.interviewId);
        const feedbackDate = new Date(feedback.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - feedbackDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let dateText = '';
        if (diffDays === 0) {
            dateText = 'Today';
        } else if (diffDays === 1) {
            dateText = '1 day ago';
        } else if (diffDays < 7) {
            dateText = `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            dateText = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else {
            const months = Math.floor(diffDays / 30);
            dateText = `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }
        
        return {
            topic: interview ? `${interview.role} - ${interview.type}` : 'Interview',
            date: dateText,
            score: feedback.totalScore,
        };
    });
    
    return recentTopics;
}

export async function getUserStats(userId: string) {
    const feedbacks = await getUserFeedbacks(userId);
    const activityData = await getUserActivityData(userId);
    
    if (feedbacks.length === 0) {
        return {
            totalInterviews: 0,
            averageScore: 0,
            bestScore: 0,
            currentStreak: 0,
            maxStreak: 0,
            activeDays: 0,
        };
    }
    
    // Calculate total interviews
    const totalInterviews = feedbacks.length;
    
    // Calculate average and best scores
    const totalScore = feedbacks.reduce((sum, feedback) => sum + feedback.totalScore, 0);
    const averageScore = Math.round(totalScore / totalInterviews);
    const bestScore = Math.max(...feedbacks.map(f => f.totalScore));
    
    // Calculate active days
    const activeDays = Object.keys(activityData).length;
    
    // Calculate streaks
    const dates = Object.keys(activityData)
        .map(date => new Date(date))
        .sort((a, b) => a.getTime() - b.getTime());
    
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    if (dates.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calculate current streak (consecutive days from today backwards)
        let checkDate = new Date(today);
        while (true) {
            const dateKey = checkDate.toISOString().split('T')[0];
            if (activityData[dateKey]) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        // Calculate max streak
        for (let i = 0; i < dates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prevDate = new Date(dates[i - 1]);
                const currDate = new Date(dates[i]);
                const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    maxStreak = Math.max(maxStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        }
        maxStreak = Math.max(maxStreak, tempStreak);
    }
    
    return {
        totalInterviews,
        averageScore,
        bestScore,
        currentStreak,
        maxStreak,
        activeDays,
    };
}