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
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/firebase/client";
import { signUp, signIn } from "@/lib/actions/auth.action";
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
    const formSchema = type === "sign-in" ? signInSchema : signUpSchema;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: type === "sign-in" 
          ? {
              email: "",
              password: ""
            }
          : {
              name: "",
              email: "",
              password: ""
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
                router.push('/sign-in');
            }else{

                const {email, password} = values as { email: string; password: string };

                console.log("AuthForm: Starting sign in for:", email);

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                console.log("AuthForm: Firebase Auth successful");

                const idToken = await userCredentials.user.getIdToken();
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
                
                // Use router.push directly - Next.js handles the navigation
                router.push('/');
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

    const isSignIn = type === "sign-in";
    
  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
           <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="logo" height={32} width={38}/>
                <h2 className="text-primary-100">PrepWise</h2>
           </div>
           <h3 className="text-center">Practise job interview with AI</h3>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(
                onSubmit,
                (errors) => {
                    console.log("Form validation errors:", errors);
                    toast.error("Please fix the form errors");
                }
            )} className="w-full space-y-6 mt-4 form">
                 {!isSignIn &&  (
                    <FormField control={form.control} 
                               name="name" 
                               label="Name" 
                               placeholder="Your Name"/>
                 )} 
                  <FormField control={form.control} 
                               name="email" 
                               label="Email" 
                               placeholder="Your email address"
                               type="email"
                               />
                  <FormField control={form.control} 
                               name="password" 
                               label="password" 
                               placeholder="Enter your password"
                               type="password"
                               />
                <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an account'}</Button>
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
  )
}

export default AuthForm

// this will make sure that the name feild is only appear when we on the sign in page