import { ReactNode } from "react";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { Target, LineChart, Sparkles } from "lucide-react";

const Authlayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/dashboard");

  return (
    <div className="auth-layout pt-20">
      <div className="flex w-full gap-10 items-stretch max-w-7xl mx-auto">
        {/* Left marketing panel - desktop & tablet only */}
        <section className="hidden md:flex flex-1 flex-col justify-center gap-6 pr-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-100 leading-tight">
              Code. Practice.
              <br />
              Track your interview journey.
            </h1>
            <p className="mt-3 text-sm md:text-base text-light-100/80 max-w-md">
              PrepWise helps you run realistic AI mock interviews, measure your
              progress, and turn every session into actionable improvement.
            </p>
          </div>

          <div className="space-y-4 text-sm md:text-base">
            <FeatureRow
              icon={<Target className="size-4" />}
              title="Focused practice"
              description="Target specific roles and tech stacks with tailored interviews."
            />
            <FeatureRow
              icon={<LineChart className="size-4" />}
              title="Progress insights"
              description="See how your scores evolve across communication, problem solving and more."
            />
            <FeatureRow
              icon={<Sparkles className="size-4" />}
              title="AI feedback"
              description="Get detailed, structured feedback after every interview attempt."
            />
          </div>

          <p className="text-xs text-light-100/60">
            No long sign-up forms. Use your email or Google to jump straight
            into your next practice session.
          </p>
        </section>

        {/* Right auth form */}
        <section className="flex-1 flex items-center justify-center">
          {children}
        </section>
      </div>
    </div>
  );
};

const FeatureRow = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-dark-200 border border-primary-200/30 text-primary-200">
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-light-100/70">{description}</p>
    </div>
  </div>
);

export default Authlayout;