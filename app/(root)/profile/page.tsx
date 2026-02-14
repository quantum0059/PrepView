import { getCurrentUser } from '@/lib/actions/auth.action';
import { getUserProfileScores, getUserActivityData, getUserStats } from '@/lib/actions/general.action';
import Profile from '@/components/ProfilePage';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Fetch real data
  const [profileScores, activityData, userStats] = await Promise.all([
    getUserProfileScores(user.id),
    getUserActivityData(user.id),
    getUserStats(user.id),
  ]);

  return <Profile user={user} profileScores={profileScores} activityData={activityData} userStats={userStats} />;
};

export default Page;