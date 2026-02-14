
"use client"
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  TrendingUp,
  Zap,
  Trophy,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import EditProfileModal from "@/components/EditProfileModal";
import { useRouter } from "next/navigation";

interface ProfileProps {
  user: any;
  profileScores?: {
    technicalKnowledge: number;
    communicationSkills: number;
    problemSolving: number;
    confidenceClarity: number;
  };
  activityData?: Record<string, number>;
  userStats?: {
    totalInterviews: number;
    averageScore: number;
    bestScore: number;
    currentStreak: number;
    maxStreak: number;
    activeDays: number;
  };
}

const Profile = ({
  user,
  profileScores,
  activityData,
  userStats,
}: ProfileProps) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /* ---------------- Real Stats from Backend ---------------- */
  const totalInterviews = userStats?.totalInterviews || 0;
  const averageScore = userStats?.averageScore || 0;
  const bestScore = userStats?.bestScore || 0;
  const currentStreak = userStats?.currentStreak || 0;
  const maxStreak = userStats?.maxStreak || 0;
  const activeDays = userStats?.activeDays || 0;

  /* ---------------- Mastery ---------------- */

  const [animatedStats, setAnimatedStats] = useState([
    { name: "Technical Knowledge", value: 0, target: profileScores?.technicalKnowledge || 0 },
    { name: "Communication Skills", value: 0, target: profileScores?.communicationSkills || 0 },
    { name: "Problem Solving", value: 0, target: profileScores?.problemSolving || 0 },
    { name: "Confidence & Clarity", value: 0, target: profileScores?.confidenceClarity || 0 },
  ]);

  useEffect(() => {
    setAnimatedStats(prev =>
      prev.map(stat => ({ ...stat, value: stat.target }))
    );
  }, [profileScores]);

  /* ---------------- Heatmap Scroll ---------------- */

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  /* ---------------- Heatmap Generator ---------------- */

  const generateMonthlyHeatmap = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const months: any[] = [];
    let current = new Date(startDate);

    while (current <= today) {
      const year = current.getFullYear();
      const monthIndex = current.getMonth();
      const monthName = current.toLocaleString("en-US", { month: "short" });

      const firstDay = new Date(year, monthIndex, 1);
      const lastDay = new Date(year, monthIndex + 1, 0);

      const days = [];
      const firstDayOffset = firstDay.getDay();

      for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(year, monthIndex, d);
        const key = date.toISOString().split("T")[0];
        const count = activityData?.[key] || 0;

        let level = 0;
        if (count > 0) {
          // Map activity count to level (0-4)
          if (count === 1) level = 1;
          else if (count === 2) level = 2;
          else if (count >= 3 && count <= 4) level = 3;
          else level = 4;
        }

        days.push({ level, date, count });
      }

      months.push({ name: monthName, days, firstDayOffset });
      current = new Date(year, monthIndex + 1, 1);
    }

    return months;
  };

  const heatmapData = generateMonthlyHeatmap();

  return (
    <div className="min-h-screen font-mona-sans text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Sidebar */}
          <aside className="lg:w-1/4 flex-shrink-0">
            <div className="sticky top-24 flex flex-col items-center lg:items-start gap-6">
              <div className="relative size-32 sm:size-40 lg:size-48 rounded-full overflow-hidden border-[4px] border-dark-200 bg-dark-300 flex items-center justify-center shadow-lg">
                {user?.image ? (
                  <Image 
                    src={user.image} 
                    alt="Profile" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-primary-200 text-dark-100 text-4xl sm:text-5xl lg:text-6xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="text-center lg:text-left w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{user?.name || 'User'}</h1>
                <p className="text-sm sm:text-base text-light-100/60 mb-3">
                  @{user?.email?.split("@")[0] || 'username'}
                </p>
                {user?.bio && (
                  <p className="text-sm text-light-100/80 mb-4 line-clamp-3">
                    {user.bio}
                  </p>
                )}
                {(user?.link1 || user?.link2 || user?.link3 || user?.link4) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[user.link1, user.link2, user.link3, user.link4]
                      .filter(Boolean)
                      .map((link, idx) => {
                        try {
                          const url = new URL(link);
                          const hostname = url.hostname.replace('www.', '');
                          const icon = hostname.includes('github') ? '💻' : 
                                     hostname.includes('linkedin') ? '💼' : 
                                     hostname.includes('twitter') || hostname.includes('x.com') ? '🐦' : 
                                     hostname.includes('leetcode') ? '⚡' : 
                                     hostname.includes('portfolio') ? '🎨' : '🔗';
                          
                          return (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-200/50 border border-primary-200/20 hover:border-primary-200/40 hover:bg-dark-200 transition-all text-xs text-primary-200 hover:text-primary-100"
                            >
                              <span>{icon}</span>
                              <span className="truncate max-w-[120px]">{hostname}</span>
                            </a>
                          );
                        } catch {
                          return (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-200/50 border border-primary-200/20 hover:border-primary-200/40 hover:bg-dark-200 transition-all text-xs text-primary-200 hover:text-primary-100"
                            >
                              <span>🔗</span>
                              <span className="truncate max-w-[120px]">Link {idx + 1}</span>
                            </a>
                          );
                        }
                      })}
                  </div>
                )}
              </div>

              <Button 
                className="btn-secondary w-full mt-2"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit profile
              </Button>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 space-y-8 lg:space-y-10 min-w-0">

            {/* Hero Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <StatCard icon={<Trophy size={18} />} label="Total Interviews" value={totalInterviews} />
              <StatCard icon={<TrendingUp size={18} />} label="Average Score" value={`${averageScore}%`} />
              <StatCard icon={<Zap size={18} />} label="Best Score" value={`${bestScore}%`} />
              <StatCard icon={<Flame size={18} />} label="Current Streak" value={`${currentStreak} days`} />
            </section>

            {/* Activity */}
            <section>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2 text-white">
                  <TrendingUp size={18} className="text-primary-200" /> Activity
                </h2>
                <div className="text-sm text-light-100/60">
                  {totalInterviews} interviews · {activeDays} active days · Max streak {maxStreak}
                </div>
              </div>

              <div className="card-border !w-full">
                <div className="card p-4 sm:p-6 relative overflow-hidden">

                {/* Scroll Buttons */}
                <button
                  onClick={() => scroll("left")}
                  className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 
                  bg-dark-200/90 hover:bg-dark-200 border border-primary-200/20 
                  backdrop-blur-md size-9 rounded-full items-center justify-center 
                  text-primary-200 hover:text-primary-100 transition-all shadow-lg"
                  aria-label="Scroll left"
                >
                  <span className="text-xl leading-none">‹</span>
                </button>

                <button
                  onClick={() => scroll("right")}
                  className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 
                  bg-dark-200/90 hover:bg-dark-200 border border-primary-200/20 
                  backdrop-blur-md size-9 rounded-full items-center justify-center 
                  text-primary-200 hover:text-primary-100 transition-all shadow-lg"
                  aria-label="Scroll right"
                >
                  <span className="text-xl leading-none">›</span>
                </button>

                <div
                  ref={scrollRef}
                  className="overflow-x-auto no-scrollbar pb-2"
                >
                  <div className="flex gap-6 sm:gap-8 min-w-fit">

                    {heatmapData.map((month, idx) => (
                      <div key={idx} className="flex flex-col items-center shrink-0 gap-2">

                        <div className="grid grid-rows-7 grid-flow-col gap-[3px] w-fit">

                          {Array.from({ length: month.firstDayOffset }).map((_, i) => (
                            <div key={i} className="size-[10px] sm:size-[11px]" />
                          ))}

                          {month.days.map((day: any, i: number) => {
                            const opacityMap: Record<number, string> = {
                              0: 'opacity-0',
                              1: 'opacity-30',
                              2: 'opacity-50',
                              3: 'opacity-75',
                              4: 'opacity-100',
                            };
                            
                            return (
                              <div
                                key={i}
                                className={`size-[10px] sm:size-[11px] rounded-[2px] cursor-pointer hover:ring-2 hover:ring-primary-200 hover:scale-110 transition-all ${
                                  day.level === 0
                                    ? "bg-dark-300"
                                    : `bg-primary-200 ${opacityMap[day.level] || 'opacity-100'}`
                                }`}
                                title={`${day.date.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}: ${day.count || 0} interview${(day.count || 0) !== 1 ? 's' : ''}`}
                              />
                            );
                          })}

                        </div>

                        <span className="text-xs text-light-100/60 mt-1 font-medium">
                          {month.name}
                        </span>

                      </div>
                    ))}

                  </div>
                </div>
                </div>
              </div>
            </section>

            {/* Mastery */}
            <section>
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2 text-white">
                <Zap size={18} className="text-primary-200" /> Mastery
              </h2>

              <div className="card-border !w-full">
                <div className="card p-6 sm:p-8 space-y-5 sm:space-y-6">
                  {animatedStats.map((stat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-light-100 font-medium">{stat.name}</span>
                        <span className="text-primary-200 font-bold text-base">
                          {Math.round(stat.value)}%
                        </span>
                      </div>

                      <div className="h-2.5 bg-dark-300 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                          className="h-full bg-primary-200 rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={() => {
          router.refresh();
        }}
      />
    </div>
  );
};

/* ---------------- Stat Card ---------------- */

const StatCard = ({ icon, label, value }: any) => (
  <div className="card-border !w-full h-full">
    <div className="card p-4 sm:p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2 text-light-100/60 text-xs sm:text-sm">
        <span className="text-primary-200">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-primary-200">{value}</div>
    </div>
  </div>
);

export default Profile;
