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




const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-in" ? z.string().min(3) : z.string().optional(),

        email: z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({type}: {type: FormType}) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          password: ""
        },
      })
    
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if(type === 'sign-up'){

                const { name, email, password } = values;

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

                const {email, password} = values;

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredentials.user.getIdToken();
                
                if(!idToken){
                    toast.error('Sign in failed');
                    return;
                }

                const result = await signIn({
                    email, idToken
                });

                if(!result || !result.success){
                    toast.error(result?.message || 'Failed to sign in');
                    return;
                }

                toast.success('Signed-in successfully.');
                router.push('/');
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            
            // Handle Firebase Auth errors
            let errorMessage = 'An error occurred';
            
            if(error?.code === 'auth/user-not-found'){
                errorMessage = 'User does not exist. Please sign up first.';
            } else if(error?.code === 'auth/wrong-password'){
                errorMessage = 'Incorrect password. Please try again.';
            } else if(error?.code === 'auth/invalid-email'){
                errorMessage = 'Invalid email address.';
            } else if(error?.code === 'auth/too-many-requests'){
                errorMessage = 'Too many failed attempts. Please try again later.';
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
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