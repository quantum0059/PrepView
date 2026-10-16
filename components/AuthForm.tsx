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
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import {auth, googleProvider} from "@/firebase/client";
import { signUp, signIn } from "@/lib/actions/auth.action";
import { useState } from "react";
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
    const formSchema = type === "sign-in" ? signInSchema : signUpSchema;
    const form = useForm<{ name?: string; email: string; password: string }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
      })
    
      // 2. Define a submit handler.
      async function onSubmit(values: any) {
        console.log("onSubmit called with values:", values);
        console.log("Form type:", type);
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

                console.log("AuthForm: Starting sign in for:", email);

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                console.log("AuthForm: Firebase Auth successful");

                const idToken = await userCredentials.user.getIdToken(true);
                console.log("AuthForm: Got idToken");
                
                if(!idToken){
                    console.error("AuthForm: No idToken received");
                    toast.error('Sign in failed - no token received');
                    return;
                }

                console.log("AuthForm: Calling signIn server action");
                const result = await signIn({
                    email, idToken
                });

                console.log("AuthForm: SignIn result:", result);

                if(!result){
                    console.error("AuthForm: No result returned from signIn");
                    toast.error('Sign in failed - no response from server');
                    return;
                }

                if(!result.success){
                    console.error("AuthForm: SignIn failed:", result.message);
                    toast.error(result.message || 'Failed to sign in');
                    return;
                }

                console.log("AuthForm: Sign in successful, showing toast and redirecting");
                
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

    async function handleGoogleSignIn() {
        try {
          setIsLoading(true);
    
          // 1) Ask Firebase Auth to sign in with Google
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
    
          if (!user.email) {
            toast.error("Google account has no email.");
            setIsLoading(false);
            return;
          }
    
          // 2) Get ID token from Firebase user
          const idToken = await user.getIdToken(true);
    
          // 3) Call existing server action – it will:
          //    - verify token
          //    - create Firestore user if missing
          //    - set session cookie
          const serverResult = await signIn({
            email: user.email,
            idToken,
          });
    
          if (!serverResult || !serverResult.success) {
            toast.error(serverResult?.message || "Failed to sign in with Google");
            setIsLoading(false);
            return;
          }
    
          toast.success("Signed in with Google");
          router.refresh();
          setTimeout(() => {
            router.push("/dashboard");
          }, 300);
        } catch (error: any) {
          console.error("Google sign-in error:", error);
          let msg = "Failed to sign in with Google.";
          if (error?.code === "auth/popup-closed-by-user") {
            msg = "Sign-in popup was closed.";
          } else if (error?.code === "auth/popup-blocked") {
            msg = "Sign-in popup was blocked by browser. Please allow popups.";
          } else if (error?.code === "auth/operation-not-allowed") {
            msg = "Google Sign-In is not enabled in Firebase Console.";
          } else if (error?.code === "auth/unauthorized-domain") {
            msg = "Domain is not authorized in Firebase Console.";
          } else if (error?.message) {
            msg = error.message;
          }
          toast.error(msg);
          setIsLoading(false);
        }
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
              onSubmit={form.handleSubmit(
                onSubmit,
                (errors) => {
                  console.log("Form validation errors:", errors);
                  toast.error("Please fix the form errors");
                }
              )}
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