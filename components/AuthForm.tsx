"use client"
import {zodResolver } from "@hookform/resolvers/zod"
import {useForm } from "react-hook-form"
import {z} from "zod"
import {Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import Image from "next/image"; 
import Link from "next/link"
import {toast} from "sonner";
import FormField from "@/components/FormField"
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, getRedirectResult} from "firebase/auth";
import {auth, googleProvider} from "@/firebase/client";
import { signUp, signIn } from "@/lib/actions/auth.action";
import { useState, useEffect, useRef } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
//sonner toast is shadcn compoenent used for define error more specifically




const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
});

const signUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(3, "Password must be at least 3 characters"),
});

const AuthForm = ({type}: {type: FormType}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const redirectProcessed = useRef(false);
    const formSchema = type === "sign-in" ? signInSchema : signUpSchema;
    const form = useForm<{ name?: string; email: string; password: string }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
      })
    
      async function onSubmit(values: any) {
        try {
            if(type === 'sign-up'){

                const { name, email, password } = values as { name: string; email: string; password: string };

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if(!result || !result.success){
                    toast.error(result?.message || 'Failed to create account');
                    return;
                }
                toast.success('Account created successfully. Please sign in.');
                setIsLoading(true);
                // Small delay to ensure loading screen is visible, then navigate
                setTimeout(() => {
                router.push('/sign-in');
                }, 300);
            }else{

                const {email, password} = values as { email: string; password: string };

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredentials.user.getIdToken(true);

                if(!idToken){
                    console.error("AuthForm: No idToken received");
                    toast.error('Sign in failed - no token received');
                    return;
                }

                const result = await signIn({ email, idToken });

                if(!result){
                    toast.error('Sign in failed - no response from server');
                    return;
                }

                if(!result.success){
                    toast.error(result.message || 'Failed to sign in');
                    return;
                }
                
                // Show toast first
                toast.success('Signed-in successfully.');
                setIsLoading(true);
                // Small delay to ensure loading screen is visible, then navigate
                setTimeout(() => {
                    router.push('/dashboard');
                }, 300);
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            
            // Handle Firebase Auth errors
            let errorMessage = 'An error occurred';
            
            if(error?.code === 'auth/invalid-credential'){
                errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            } else if(error?.code === 'auth/user-not-found'){
                errorMessage = 'User does not exist. Please sign up first.';
            } else if(error?.code === 'auth/wrong-password'){
                errorMessage = 'Incorrect password. Please try again.';
            } else if(error?.code === 'auth/invalid-email'){
                errorMessage = 'Invalid email address.';
            } else if(error?.code === 'auth/too-many-requests'){
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if(error?.code === 'auth/user-disabled'){
                errorMessage = 'This account has been disabled. Please contact support.';
            } else if(error?.code === 'auth/network-request-failed'){
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if(error?.message){
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        }
    }

    // Handle the result after Google redirects the user back to the app
    useEffect(() => {
      if (redirectProcessed.current) return;
      redirectProcessed.current = true;

      getRedirectResult(auth)
        .then(async (result) => {
          if (!result) {
            // No redirect in progress — normal page load, do nothing
            return;
          }
          setIsLoading(true);
          const user = result.user;
          if (!user.email) {
            toast.error("Google account has no email.");
            setIsLoading(false);
            return;
          }
          const idToken = await user.getIdToken(true);
          const serverResult = await signIn({ email: user.email, idToken });
          if (!serverResult || !serverResult.success) {
            toast.error(serverResult?.message || "Failed to sign in with Google");
            setIsLoading(false);
            return;
          }
          toast.success("Signed in with Google!");
          router.replace("/dashboard");
        })
        .catch((error: any) => {
          console.error("Google redirect result error:", error);
          let msg = "Failed to sign in with Google.";
          if (error?.code === "auth/operation-not-allowed") {
            msg = "Google Sign-In is not enabled in Firebase Console.";
          } else if (error?.code === "auth/unauthorized-domain") {
            msg = "This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains.";
          } else if (error?.message) {
            msg = error.message;
          }
          toast.error(msg);
          setIsLoading(false);
        });
    }, []);

    function handleGoogleSignIn() {
      // Use redirect instead of popup — popups are blocked by browsers on
      // production / cross-origin domains but redirect flow always works.
      setIsLoading(true);
      signInWithRedirect(auth, googleProvider);
    }

    const isSignIn = type === "sign-in";
    
  return (
    <>
      {isLoading && <LoadingSpinner />}
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
           <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="logo" height={32} width={38}/>
                <h2 className="text-primary-100">PrepWise</h2>
           </div>
           <h3 className="text-center">Practise job interview with AI</h3>
        <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 mt-4 form"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Your Name"
                />
              )}
              <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Your email address"
                type="email"
              />
              <FormField
                control={form.control}
                name="password"
                label="password"
                placeholder="Enter your password"
                type="password"
              />

              <Button className="btn" type="submit">
                {isSignIn ? "Sign in" : "Create an account"}
              </Button>

              {isSignIn && (
                <>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-px flex-1 bg-dark-200" />
                    <span className="text-xs text-light-100/60">or</span>
                    <div className="h-px flex-1 bg-dark-200" />
                  </div>
                  <Button
                    type="button"
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-dark-100 hover:bg-gray-100 rounded-full border border-input text-sm font-medium transition-all"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <Image
                      src="/google-logo.svg"
                      alt="Google"
                      width={18}
                      height={18}
                      className="mr-1"
                    />
                    <span>Sign in with Google</span>
                  </Button>
                </>
              )}
            </form>
        </Form>
        <p className="text-center">
            {isSignIn ? 'No account yet?' : 'Have an account already?'}
            <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                {!isSignIn ?  "Sign in" : "Sign up"}
            </Link>
        </p>
        </div>
    </div>
    </>
  )
}

export default AuthForm

// this will make sure that the name feild is only appear when we on the sign in page