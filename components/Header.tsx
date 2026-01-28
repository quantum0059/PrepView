"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SiReadthedocs } from "react-icons/si";
import { TbPresentationAnalytics } from "react-icons/tb";
import {  MdKeyboardArrowDown } from "react-icons/md";
import {
  PiMagicWandDuotone,
  PiUserFocusFill,
} from "react-icons/pi";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import Image from "next/image";

const navigationItems = [
    {
      id: 1,
      title: "Features",
      href: "#features",
      children: [
        {
          title: "AI Interviews",
          href: "#ai-interviews",
          description: "Practice with voice-based AI interviewer",
          icon: PiMagicWandDuotone,
        },
        {
          title: "Custom Interviews",
          href: "#custom-interviews",
          description: "Tailor interviews to your role and tech stack",
          icon: PiUserFocusFill,
        },
        {
          title: "AI Feedback",
          href: "#ai-feedback",
          description: "Get comprehensive scores and recommendations",
          icon: TbPresentationAnalytics,
        },
        {
          title: "Interview History",
          href: "#history",
          description: "Track your progress over time",
          icon: SiReadthedocs,
        },
      ],
    },
    {
      id: 2,
      title: "How It Works",
      href: "#how-it-works",
    },
    {
      id: 3,
      title: "Pricing",
      href: "#pricing",
    },
    {
      id: 4,
      title: "Resources",
      href: "#resources",
      children: [
        {
          title: "Documentation",
          href: "#docs",
          description: "Guides and setup instructions",
          icon: SiReadthedocs,
        },
        {
          title: "Blog",
          href: "#blog",
          description: "Tips and interview strategies",
          icon: PiUserFocusFill,
        },
      ],
    },
  ];

  interface HeaderProps {
    user?: {
        name: string;
        email: string;
        id: string;
    } | null;
  }

const Header06 = ({ user}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (id: number) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  useEffect(() => {
    const getScrollParent = (
      node: HTMLElement | null,
    ): HTMLElement | Window => {
      if (!node) return window;
      const overflowY = window.getComputedStyle(node).overflowY;
      const isScrollable = overflowY === "auto" || overflowY === "scroll";

      if (isScrollable && node.scrollHeight > node.clientHeight) {
        return node;
      }
      return getScrollParent(node.parentElement);
    };

    const scrollParent = getScrollParent(headerRef.current);

    const handleScroll = () => {
      const scrollY =
        scrollParent === window
          ? window.scrollY
          : (scrollParent as HTMLElement).scrollTop;

      setIsScrolled(scrollY > 50);
    };

    scrollParent.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div ref={headerRef} className="fixed top-0 left-0 z-50 w-full px-2 pt-2">
      <div
        className={cn(
          "mx-auto flex h-13.5 w-full max-w-7xl items-center justify-between rounded-xl border border-transparent px-4 transition-all duration-300 ease-in-out",
          isScrolled &&
            "max-w-6xl rounded-xl border border-primary-200/20 bg-dark-200/80 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-lg",
        )}
      >
        <Logo/>

        <div className="hidden md:flex">
          <NavigationLinks />
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          {user ? (
            <Link href="/"
               className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-200 text-dark-100 font-bold text-lg hover:bg-primary-200/80 transition-all duration-100"
               >
                {user.name?.charAt(0).toUpperCase() || 'U'}
            </Link>
          ): (
            <Button
              asChild
              className="btn-primary cursor-pointer rounded-full px-5 py-2 text-sm font-bold text-dark-100 bg-primary-200 hover:bg-primary-200/80 shadow-sm transition-all duration-100"
            >
                <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center rounded-md p-2 text-primary-100 transition-all duration-100 hover:bg-dark-200"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <HiX size={22} className="text-primary-100" />
              ) : (
                <HiMenuAlt2 size={22} className="text-primary-100" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-2 overflow-hidden rounded-xl border border-primary-200/20 bg-dark-200 shadow-lg md:hidden "
          >
            <div className="flex flex-col p-4">
              {navigationItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isAccordionOpen = activeAccordion === item.id;

                if (!hasChildren) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block border-b border-primary-200/20 py-4 text-sm font-medium text-light-100 transition-all duration-100 hover:text-primary-200"
                    >
                      {item.title}
                    </a>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="border-b border-primary-200/20 last:border-b-0"
                  >
                    <button
                      onClick={() => toggleAccordion(item.id)}
                      className="flex w-full items-center justify-between py-4 text-sm font-medium text-light-100 transition-all duration-100 hover:text-primary-200"
                    >
                      {item.title}
                      <MdKeyboardArrowDown
                        className={cn(
                          "h-5 w-5 transition-transform duration-300",
                          isAccordionOpen ? "rotate-180" : "",
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {isAccordionOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-2 pb-4 pl-2">
                            {item.children!.map((child) => {
                              const Icon = child.icon;
                              return (
                                <a
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsOpen(false)}
                                  className="group block rounded-md p-2 transition-colors hover:bg-dark-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.1)] ring-1 ring-primary-200/20 bg-dark-300">
                                      <Icon className="size-4 text-primary-200 group-hover:text-primary-100" />
                                    </div>
                                    <div className="flex min-w-0 flex-col gap-0.5">
                                      <div className="text-sm font-medium text-primary-100">
                                        {child.title}
                                      </div>
                                      <div className="truncate text-xs text-light-100">
                                        {child.description}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Header06;

const NavigationLinks = () => {
  const [activeLink, setActiveLink] = useState<number | null>(null);

  const handleAciveLink = (val: number | null) => {
    setActiveLink(val);
  };

  return (
    <div
      onMouseLeave={() => handleAciveLink(null)}
      className="relative flex h-fit gap-6"
    >
      {navigationItems.map((item, index) => (
        <NavLinks
          key={item.id}
          index={index}
          item={item}
          activeLink={activeLink}
          handleAciveLink={handleAciveLink}
        />
      ))}

      <AnimatePresence>
        {activeLink && (
          <DropdownContent key={activeLink} activeLink={activeLink} />
        )}
      </AnimatePresence>
    </div>
  );
};

interface NavLinksProps {
  item: (typeof navigationItems)[0];
  activeLink: number | null;
  handleAciveLink: (val: number | null) => void;
  index: number;
}

const NavLinks = ({
  item,
  activeLink,
  handleAciveLink,
  index,
}: NavLinksProps) => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <motion.a
        key={item.id}
        custom={index}
        href={item.href}
        onMouseEnter={() => handleAciveLink(null)}
        className={cn(
          "p-2 text-[13.5px] font-medium transition-colors",
          pathname?.startsWith(item.href)
            ? "text-primary-100"
            : "text-light-100 hover:text-primary-200",
        )}
      >
        {item.title}
      </motion.a>
    );
  }

  return (
    <motion.button
      key={item.id}
      custom={index}
      id={`tab-${item.id}`}
      onMouseEnter={() => handleAciveLink(item.id)}
      onClick={() => handleAciveLink(item.id)}
      className={cn(
        "flex items-center gap-1 p-2 text-[13.5px] font-medium transition-colors",
        activeLink === item.id
          ? "text-primary-100"
          : "text-light-100 hover:text-primary-200 ",
      )}
    >
      <span>{item.title}</span>
      <MdKeyboardArrowDown
        className={cn(
          "mt-1 h-3 w-3 transition-transform",
          activeLink === item.id ? "rotate-180" : "",
        )}
      />
    </motion.button>
  );
};

const DropdownContent = ({ activeLink }: { activeLink: number | null }) => {
  const activeItem = navigationItems.find((item) => item.id === activeLink);

  if (!activeItem || !activeItem.children) return null;

  const isLastItem = activeItem.id === navigationItems.at(-1)?.id;

  const columns = isLastItem ? 1 : 2;

  const chunkSize = Math.ceil(activeItem.children.length / columns);

  const chunks = Array.from({ length: columns }, (_, i) =>
    activeItem.children.slice(i * chunkSize, (i + 1) * chunkSize),
  );

  return (
    <motion.div
      id="dropdown-content"
      initial={{
        opacity: 0,
        y: 10,
        filter: "blur(8px)",
        transition: {
          duration: 0.35,
          ease: "easeInOut",
        },
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.35,
          ease: "easeInOut",
        },
      }}
      exit={{
        opacity: 0,
        y: 10,
        filter: "blur(8px)",
        transition: {
          duration: 0.35,
          ease: "easeInOut",
        },
      }}
      className={cn(
        "absolute top-9 -left-16 w-140 rounded-lg bg-dark-200 p-1 shadow-lg ring-1 ring-primary-200/20",
        activeItem?.title ===
          navigationItems[navigationItems.length - 1].title &&
          "grid grid-cols-2 gap-x-2",
      )}
    >
      <div
        className={cn(
          "rounded-md bg-dark-300 ring-1 ring-primary-200/20",
          activeItem?.title === navigationItems[0].title &&
            "shadow-md shadow-black/15",
        )}
      >
        {navigationItems.map((item) => (
          <div className="overflow-hidden" key={item.id}>
            {activeLink === item.id && item.children && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div
                  className={cn(
                    "grid grid-cols-2 divide-x divide-primary-200/20",
                    item.title ===
                      navigationItems[navigationItems.length - 1].title &&
                      "grid-cols-1 divide-x-0",
                  )}
                >
                  {chunks.map((group, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-2 p-2">
                      {group.map((link) => {
                        const Icon = link.icon;
                        return (
                          <a
                            key={link.href}
                            href={link.href}
                            className="group block rounded-md p-2 transition-colors hover:bg-dark-200"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex min-h-10 min-w-10 items-center justify-center rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.1)] ring-1 ring-primary-200/20 bg-dark-300">
                                <Icon className="size-5 text-primary-200 group-hover:text-primary-100" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <div className="text-sm font-medium text-primary-100">
                                  {link.title}
                                </div>
                                <div className="text-xs text-light-100">
                                  {link.description}
                                </div>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      {activeItem.id === navigationItems.at(-1)?.id && (
        <a
          className="group flex h-full cursor-pointer flex-col gap-2 overflow-hidden p-3"
          href="#"
        >
          <div>
            <div className="flex w-full items-center justify-between">
              <p className="text-primary text-sm font-medium">Changelog</p>
            </div>
            <p className="text-muted-foreground text-xs">
              Recent changes across releases
            </p>
          </div>
          <div className="relative flex size-full h-44 translate-y-4 justify-center">
            <div className="absolute top-0 z-0 h-full w-[80%] rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:scale-[0.95] dark:border-neutral-800 dark:bg-neutral-900" />

            <div className="absolute top-2 z-10 h-full w-[90%] rounded-xl border border-neutral-200 bg-white shadow-md transition-all duration-700 ease-out group-hover:-translate-x-1 group-hover:-translate-y-4 group-hover:scale-[0.97] dark:border-neutral-800 dark:bg-neutral-900/90" />

            <div className="absolute top-4 z-20 h-full w-full overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-500 ease-out group-hover:-translate-y-6 group-hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-neutral-100 dark:bg-neutral-800" />
                    <div className="h-3 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                  </div>
                  <div className="h-2 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                </div>

                <div className="space-y-1.5 py-1 transition-transform duration-500 group-hover:translate-x-0.5">
                  <div className="h-3 w-3/4 rounded-md bg-neutral-200/80 dark:bg-neutral-800" />
                  <div className="h-3 w-1/2 rounded-md bg-neutral-200/80 dark:bg-neutral-800" />
                </div>

                <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800" />

                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 transition-all duration-500"
                      style={{
                        transitionDelay: `${i * 60}ms`,
                      }}
                    >
                      <div className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                      <div
                        className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800"
                        style={{ width: `${90 - i * 15}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-tr from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-white/5" />
            </div>
          </div>
        </a>
      )}
      {activeItem?.id === navigationItems[0].id && (
        <div className="px-2 pt-2 pb-1">
          <p className="group text-primary flex w-fit cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-200/50 dark:hover:bg-neutral-900/80">
            Explore all components
          </p>
        </div>
      )}
    </motion.div>
  );
};

const MyIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M65.5869 52.0195C59.6064 62.7446 48.1517 70 35 70C28.4081 70 22.2428 68.1761 16.9785 65.0078C24.0411 65.0505 30.5152 64.4499 36.8809 63.0947C46.275 61.0948 55.321 57.476 65.5869 52.0195Z"
      fill="currentColor"
    />
    <path
      d="M69.9023 37.6084C69.7246 40.0209 69.3033 42.3653 68.6611 44.6172C56.2627 51.6688 46.1988 55.9988 35.8398 58.2041C27.9699 59.8795 19.8406 60.3467 10.2822 59.7793C8.48159 57.9831 6.87607 55.9917 5.49902 53.8398C17.5379 55.0275 27.6247 54.6653 37.4609 52.3047C48.0044 49.7743 58.1043 44.9844 69.9023 37.6084Z"
      fill="currentColor"
    />
    <path
      d="M35 0C53.225 0 68.1937 13.9301 69.8457 31.7236C57.1262 39.9078 46.8552 44.9089 36.2949 47.4434C26.3045 49.841 15.895 50.0686 2.70117 48.5059C0.961337 44.35 0 39.7873 0 35C0 15.67 15.67 0 35 0Z"
      fill="currentColor"
    />
  </svg>
);

const Logo = () => {
  return (
    <Link href="/" className="mb-1.5 flex items-center space-x-2">
      <Image src="/logo.svg" alt="PrepWise Logo" width={38} height={32} className="h-8 w-auto"/>
      <span className="text-xl font-bold text-primary-100">
         PrepWise
      </span>
    </Link>
  );
};
