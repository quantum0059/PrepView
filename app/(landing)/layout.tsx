import {ReactNode} from 'react'
import Header06 from '@/components/Header';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.action';

const LandingLayout = async ({children} : {children: ReactNode}) => {
  // If user is authenticated, redirect to dashboard
  
   const user = await getCurrentUser();
  return (
    <>
      <Header06 user = {user}/>
      <div className="pt-20">
        {children}
      </div>
    </>
  )
}

export default LandingLayout

