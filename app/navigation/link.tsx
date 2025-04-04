import type { ReactNode } from "react";
import { NavLink } from "react-router";

type LinkProps = {
  isActive?: boolean;
  isPending?: boolean;
  isTransitioning?: boolean;
  className?: string;
  to: string;
  children?: ReactNode;
};
export const Link = ({ to, className, children, ...rest }: LinkProps) => {
  return (
    <NavLink
      className={({ isActive, isPending, isTransitioning }) => {
        const color = isActive
          ? "bg-orange-200 dark:bg-orange-600 hover:bg-orange-300 dark:hover:bg-orange-500 focus:ring-orange-500"
          : isPending
          ? "bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 focus:ring-blue-500"
          : isTransitioning
          ? "bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 focus:ring-blue-500"
          : "bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 focus:ring-blue-500";
        return `grid grid-cols-[1fr_2fr] px-2 py-1 m-1 text-xs items-center rounded ${color} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`;
      }}
      to={to}
      {...rest}
    >
      {children}
    </NavLink>
  );
};
