"use client";

import React from "react";
import {motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { 
  PiMagicWandDuotone, 
  PiUserFocusFill 
} from "react-icons/pi";
import { TbPresentationAnalytics } from "react-icons/tb";
import { SiReadthedocs } from "react-icons/si";
import { FaMicrophone, FaChartLine } from "react-icons/fa6";
import { BsPlusLg } from "react-icons/bs";
import { AnimatePresence } from "motion/react";
import { FaXTwitter, FaDiscord, FaFacebookF } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import LogoCloud01 from "@/components/LogoCloud";


// Hero Section
const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-dark-100 pt-20 pb-12 lg:pt-10">
      <div className="relative mx-auto max-w-7xl px-3 lg:px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="z-20 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6 inline-flex justify-center lg:justify-start">
              <AnimatedBadge />
            </div>

            <h1 className="text-4xl font-semibold tracking-tighter text-balance text-primary-100 sm:text-6xl">
              Get Interview-Ready with AI-powered Practice & Feedback
            </h1>

            <p className="mt-3 max-w-md text-sm text-balance text-light-100 sm:mt-6 sm:max-w-lg sm:text-lg">
              Practice real interview questions with an AI interviewer and get instant, comprehensive feedback to improve your skills.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-8 lg:justify-start">
              <Button
                asChild
                className={cn(
                  "btn-primary cursor-pointer rounded-full px-6 py-3 text-sm font-bold text-dark-100 bg-primary-200 hover:bg-primary-200/80 shadow-sm transition-all duration-300",
                )}
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>

              <Button 
                asChild
                className="group flex cursor-pointer items-center justify-center rounded-full bg-dark-200 px-6 py-3 text-sm font-medium text-primary-100 shadow-sm ring-1 ring-primary-200/20 transition-all hover:bg-dark-300"
              >
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>

          <div
            className="relative z-10 w-full max-w-none lg:w-240"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative rounded-xl bg-dark-200 p-2 ring-1 ring-primary-200/20 ring-inset"
              style={{
                transform: "rotateX(12deg) rotateY(-15deg) rotateZ(4deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="relative overflow-hidden rounded-lg border border-primary-200/20 bg-dark-300">
                <Image
                  src="/Landing.png"
                  alt="PrepWise Platform"
                  width={1600}
                  height={900}
                  unoptimized
                  priority
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-dark-100 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature Section
const FeaturesSection = () => {
  const features = [
    {
      icon: FaMicrophone,
      title: "Voice-Based AI Interviews",
      description: "Practice with real-time voice conversations. Experience natural, professional interviews powered by advanced AI.",
    },
    {
      icon: PiUserFocusFill,
      title: "Customizable Interviews",
      description: "Tailor interviews to your role, experience level, and tech stack. Get questions that match your career goals.",
    },
    {
      icon: TbPresentationAnalytics,
      title: "Comprehensive AI Feedback",
      description: "Receive detailed scores across multiple categories with actionable insights to improve your performance.",
    },
    {
      icon: PiMagicWandDuotone,
      title: "AI-Generated Questions",
      description: "Get relevant, role-specific questions powered by advanced AI models tailored to your specifications.",
    },
    {
      icon: FaChartLine,
      title: "Track Your Progress",
      description: "Monitor your interview history, review past performances, and see your improvement over time.",
    },
    {
      icon: SiReadthedocs,
      title: "Instant Results",
      description: "Get immediate feedback after completing interviews. No waiting, no delays—just instant insights.",
    },
  ];

  return (
    <section id="features" className="relative w-full overflow-hidden bg-dark-100 py-20">
      <div className="mx-auto max-w-7xl px-3 lg:px-5">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-primary-100 sm:text-4xl">
            Everything You Need to Ace Your Interviews
          </h2>
          <p className="mt-4 text-lg text-light-100">
            Powerful features designed to help you succeed
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-xl bg-dark-200 p-6 ring-1 ring-primary-200/20 transition-all hover:ring-primary-200/40 hover:bg-dark-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-200/20 ring-1 ring-primary-200/30">
                  <Icon className="h-6 w-6 text-primary-200" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-primary-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-light-100 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Companies Section
const CompaniesSection = () => {
  return <LogoCloud01 />;
};

// Footer
const Footer = () => {
  const socials = [
    { icon: <FaXTwitter />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
    { icon: <FaDiscord />, href: "#", label: "Discord" },
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
  ];

  const footerLinks = [
    {
      title: "Product",
      links: [
        { text: "Features", href: "#features" },
        { text: "How It Works", href: "#how-it-works" },
        { text: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Documentation", href: "#" },
        { text: "Blog", href: "#" },
        { text: "Support", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", href: "#" },
        { text: "Terms of Service", href: "#" },
        { text: "Privacy Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="mt-auto block border-t border-primary-200/20 px-2 py-12 sm:px-4 bg-dark-100">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-0 flex flex-col justify-between sm:mb-4 sm:flex-row">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt="PrepWise Logo" 
                width={38} 
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-medium text-primary-100">
                PrepWise
              </span>
            </Link>
            <p className="max-w-xs text-xs text-balance text-light-100 md:text-[13px]">
              Get interview-ready with AI-powered practice and comprehensive feedback.
            </p>
            <div className="mt-5 mb-6 flex items-center gap-3 sm:mb-0 sm:gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-primary-200/60 hover:text-primary-200 flex size-7 items-center justify-center rounded-full bg-dark-200 p-2 shadow-sm ring-1 ring-primary-200/20 transition-colors md:size-8 hover:bg-dark-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-4 pb-8 sm:mt-0 sm:flex-row sm:gap-16">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col space-y-3">
                <h4 className="mb-4 text-sm text-primary-100">
                  {section.title}
                </h4>
                <div className="flex flex-row flex-wrap space-y-3 space-x-3 sm:flex-col">
                  {section.links.map((link) => (
                    <a key={link.text} href={link.href}>
                      <UnderlineButton text={link.text} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-primary-200/20 pt-6">
          <p className="text-xs text-light-100">
            © {new Date().getFullYear()} PrepWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
function AnimatedBadge() {
  return (
    <a
      href="#features"
      className="group relative block rounded-full bg-dark-200/60 px-3 py-1.25 ring-1 ring-primary-200/40 outline-none"
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box]",
          "mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect",
        )}
      >
        <motion.div
          className={cn(
            "absolute top-1/2 left-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2",
            "bg-[conic-gradient(from_0deg,transparent_0_300deg,var(--tw-gradient-to)_360deg)]",
            "from-transparent via-transparent to-primary-200/80",
          )}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-primary-200 relative text-[12px] leading-none font-medium">
          AI-Powered
        </span>
      </div>

      <div
        className={cn(
          "absolute inset-0 z-0 size-full rounded-[inherit] bg-gradient-to-t from-primary-200/10 duration-200 ease-out",
          "opacity-0 group-hover:opacity-100",
        )}
      />
    </a>
  );
}

function UnderlineButton({ text }: { text: string }) {
  return (
    <div className="group relative flex items-center gap-0.5">
      <p className="relative z-10 text-xs text-light-100 transition-all duration-300 group-hover:text-primary-200 md:text-sm">
        {text}
        <span className="absolute bottom-0 left-0 h-px w-0 bg-primary-200 transition-all duration-300 group-hover:w-full"></span>
      </p>
    </div>
  );
}

// Main Landing Page
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-100">
      <HeroSection />
      <FeaturesSection />
      <CompaniesSection />
      <Footer />
    </div>
  );
}
