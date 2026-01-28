"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  AmazonIcon,
  OracleIcon,
  SalesforceIcon,
  InfosysIcon,
  CiscoIcon,
  AccentureIcon,
  GoogleIcon,
  LoveableIcon,
  CognizantIcon,
  BoltIcon,
  SapIcon,
} from "./CompanyLogos";

/* ---------------- TYPES ---------------- */

type LogoItem = {
  id: number;
  name: string;
  Component: React.ComponentType<{ className?: string }>;
};

/* ---------------- LOGO DATA ---------------- */

const allLogos: LogoItem[] = [
  { id: 1, name: "Google", Component: GoogleIcon },
  { id: 2, name: "Oracle", Component: OracleIcon },
  { id: 3, name: "Salesforce", Component: SalesforceIcon },
  { id: 4, name: "Infosys", Component: InfosysIcon },
  { id: 5, name: "Cisco", Component: CiscoIcon },
  { id: 6, name: "Accenture", Component: AccentureIcon },
  { id: 7, name: "SAP", Component: SapIcon },
  { id: 8, name: "Amazon", Component: AmazonIcon },
  { id: 9, name: "Loveable", Component: LoveableIcon },
  { id: 10, name: "Cognizant", Component: CognizantIcon },
  { id: 11, name: "Bolt", Component: BoltIcon },
];

/* ---------------- COMPONENT ---------------- */

const LogoCloud01 = () => {
  const [cycleState, setCycleState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleState((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeLogos = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const isGroupA = i < 4;
      const isGroupB = i >= 4;

      let offset = 0;

      if (isGroupA && (cycleState === 1 || cycleState === 2)) {
        offset = 8;
      }
      if (isGroupB && (cycleState === 2 || cycleState === 3)) {
        offset = 8;
      }

      // ✅ SAFE INDEX (never undefined)
      const logoIndex = (i + offset) % allLogos.length;

      return allLogos[logoIndex];
    });
  }, [cycleState]);

  return (
    <section className="flex flex-col items-center gap-y-4 px-6 py-16 bg-dark-100">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-xl font-semibold tracking-tight text-primary-100 md:text-2xl">
          Train for These Companies
        </h2>
        <p className="mt-2 text-sm text-balance text-light-100 md:text-base">
          Prepare for interviews at top tech companies and startups.
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {activeLogos.map((logo, index) => {
            const LogoComponent = logo.Component;

            return (
              <div
                key={`${logo.id}-${index}`}
                className="flex items-center justify-center px-4 py-8 md:p-8 border border-primary-200/10 hover:border-primary-200/30 transition-colors"
              >
                <div className="relative flex h-9 w-24 items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={logo.name}
                      initial={{ y: -20, opacity: 0, filter: "blur(8px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: 20, opacity: 0, filter: "blur(8px)" }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <LogoComponent className="h-8 w-20 text-primary-200" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LogoCloud01;
