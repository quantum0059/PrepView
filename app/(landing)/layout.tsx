import {ReactNode} from 'react'
import Header06 from '@/components/Header';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const LandingLayout = async ({children} : {children: ReactNode}) => {
  // If user is authenticated, redirect to dashboard
  

  return (
    <>
      <Header06 />
      <div className="pt-20">
        {children}
      </div>
    </>
  )
}

export default LandingLayout

