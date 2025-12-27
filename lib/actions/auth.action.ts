'use server'
import { db, auth } from "@/firebase/admin";
import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
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
        console.log("SignIn: Starting sign in process for:", email);
        
        // Verify the idToken - this is sufficient as it proves the user is authenticated
        const decodedToken = await auth.verifyIdToken(idToken);
        console.log("SignIn: Token verified for:", decodedToken.email);
        
        // Verify the email in the token matches the provided email
        if(decodedToken.email !== email){
            console.error("SignIn: Email mismatch");
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }

        // Create and set session cookie
        await setSessionCookie(idToken);
        console.log("SignIn: Session cookie set successfully");

        return {
            success: true,
            message: 'Signed in successfully'
        };
        
    } catch (e: any) {
         console.error("Error signing in:", e);
         console.error("Error code:", e.code);
         console.error("Error message:", e.message);

         // Handle specific Firebase Auth errors
         if(e.code === 'auth/user-not-found' || e.code === 'auth/user-disabled'){
            return {
                success: false,
                message: 'User does not exist or is disabled. Create an account instead.'
            };
         }

         if(e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password'){
            return {
                success: false,
                message: 'Invalid email or password'
            };
         }

         if(e.code === 'auth/invalid-id-token' || e.code === 'auth/argument-error'){
            return {
                success: false,
                message: 'Invalid session token. Please try again.'
            };
         }

         return{
            success: false,
            message: e.message || "Failed to sign in"
         }
    }
}

export async function setSessionCookie(idToken: string){
    try {
        const cookieStore = await cookies();

        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn: ONE_WEEK,
        });

        cookieStore.set('session', sessionCookie, {
            maxAge: ONE_WEEK,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax'
        });
        
        console.log("Session cookie created and set successfully");
    } catch (e: any) {
        console.error("Error setting session cookie:", e);
        throw e; // Re-throw to be caught by signIn
    }
}

export async function getCurrentUser():Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
          const decodeClaims = await auth.verifySessionCookie(sessionCookie, true);
          
          const userRecord = await db.
                                collection('users')
                                .doc(decodeClaims.uid)
                                .get();

          if(!userRecord) return null;

          return{
            ...userRecord.data(),
            id:userRecord.id,
          } as User;


    } catch (e) {
        console.log(e);     

        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;
}