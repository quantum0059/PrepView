import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { dummyInterviews } from '@/constants';
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action';
const page = async() => {
  const user = await getCurrentUser();
  //now to fetch the interviwes from the user and the latest interviews which is not created by user
  //for this we have to use parallel requests
  const [userInterviews, latestInterviews] = await Promise.all([
      await getInterviewsByUserId(user?.id!),
      await getLatestInterviews({userId: user?.id!})
  ])


  const hasPastInterviews = userInterviews && userInterviews?.length > 0;
  const upcomingInterviews = latestInterviews && latestInterviews?.length>0;

  return (
    <>
       <section className="card-cta">
         <div className='flex flex-col gap-6 max-w-lg'>
             <h2>
               Get Interview-Ready with AI-powered Practise & Feedback
             </h2>

             <p className="text-lg">
                Practise on real interview questions & get instant Feedback
             </p>

             <Button asChild className="btn-primary max-sm:w-full">
                 <Link href="/interview">Start an Interview</Link>
             </Button>
         </div>
         <Image src="/robot.png" alt="robot-dude" width={400} height={400} className="max-sm:hidden"/>
       </section>
       <section className="flex flex-col gap-6 mt-8">

         <h2>Your Interview</h2>

         <div className="interviews-section">
            {
              hasPastInterviews ? (
                userInterviews?.map((interview) => (
                  <InterviewCard {...interview} key={interview?.id}/>
                ))) : (
                  <p>You Haven't Taken Any Interviews yet</p>
                )
            }
              
              
         </div> 

       </section>
       <section className="flex flex-col gap-6 mt-8">

         <h2>Take an Interview</h2>

         <div className="interviews-section">
           {
              upcomingInterviews ? (
                latestInterviews?.map((interview) => (
                  <InterviewCard {...interview} key={interview?.id}/>
                ))) : (
                  <p>There are no new interviews available at the moment</p>
                )
            }
         </div> 

       </section>
    </>
  )
}

export default page
