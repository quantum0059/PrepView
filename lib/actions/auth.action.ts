'use server'
import { db, auth } from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60*60*24*7;

export async function signUp(params: SignUpParams){

    const {uid, name, email} = params
    try {

        const userRef = db.collection('users').doc(uid);
        const userSnap = await userRef.get();

    if (userSnap.exists) {
        return {
          success: false,
          message: 'User already exists. Please sign in instead.',
        };
      }
        
      await userRef.set({ name, email });

      return {
        success: true,
        message: 'Account created successfully. Please sign-in',
      };

        
    } catch (e: any) {
        
       console.error("Error creating a user", e);

       if(e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: 'This email is already in use'
            }
       }

       return {
        success: false,
        message: 'Failed to create an account'
       }
    }
}   

export async function signIn(params: SignInParams){
    const { email, idToken} = params;

    try {
        // Verify user exists - getUserByEmail throws if user doesn't exist
        const userRecord = await auth.getUserByEmail(email);

        // Verify the idToken matches the user
        const decodedToken = await auth.verifyIdToken(idToken);
        
        if(decodedToken.email !== email){
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Signed in successfully'
        };
        
    } catch (e: any) {
         console.error("Error signing in:", e);

         // Handle specific Firebase Auth errors
         if(e.code === 'auth/user-not-found'){
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            };
         }

         if(e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password'){
            return {
                success: false,
                message: 'Invalid email or password'
            };
         }

         return{
            success: false,
            message: e.message || "Failed to sign in"
         }
    }
}

export async function setSessionCookie(idToken: string){
     const cookieStore = await cookies();

     const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK,
     })

     cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
     })
}