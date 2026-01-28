import React from "react";
import {
  SiGoogle,
  SiAmazon,
  SiOracle,
  SiSalesforce,
  SiInfosys,
  SiCisco,
  SiAccenture,
  SiSap,
  SiCognizant,
} from "react-icons/si";

/* ---------------- TYPES ---------------- */

type IconProps = {
  className?: string;
};

/* ---------------- PLACEHOLDER ---------------- */

const createPlaceholderIcon = (name: string) => {
  return ({ className = "" }: IconProps) => (
    <div
      className={`${className} flex items-center justify-center rounded-md bg-muted text-primary-200 font-semibold text-sm`}
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
};

/* ---------------- BRAND ICONS ---------------- */

export const GoogleIcon = ({ className = "" }: IconProps) => (
  <SiGoogle className={className} />
);



export const AmazonIcon = ({ className = "" }: IconProps) => (
  <SiAmazon className={className} />
);


export const OracleIcon = ({ className = "" }: IconProps) => (
  <SiOracle className={className} />
);

export const SalesforceIcon = ({ className = "" }: IconProps) => (
  <SiSalesforce className={className} />
);

export const InfosysIcon = ({ className = "" }: IconProps) => (
  <SiInfosys className={className} />
);

export const CiscoIcon = ({ className = "" }: IconProps) => (
  <SiCisco className={className} />
);

export const AccentureIcon = ({ className = "" }: IconProps) => (
  <SiAccenture className={className} />
);

export const SapIcon = ({ className = "" }: IconProps) => (
  <SiSap className={className} />
);

export const CognizantIcon = ({ className = "" }: IconProps) => (
  <SiCognizant className={className} />
);



/* ---------------- CUSTOM ICONS ---------------- */

export const LoveableIcon = ({ className = "" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export const BoltIcon = ({ className = "" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 1L3 14h8l-1 9 10-13h-8l1-9z" />
  </svg>
);
