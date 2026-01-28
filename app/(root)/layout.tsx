import {ReactNode} from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { isAuthenticated, getCurrentUser } from '@/lib/actions/auth.action';
import {redirect} from "next/navigation";
import Header06 from '@/components/Header';


const Rootlayout = async ({children} : {children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if(!isUserAuthenticated) redirect('/sign-in');

  const user = await getCurrentUser();

  return (
    <>
      <Header06 user={user}/>
      <div className="root-layout pt-20 mt-0">
        {children}
      </div>
    </>
  )
}

export default Rootlayout
