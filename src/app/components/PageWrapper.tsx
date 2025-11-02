"use client";

import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  // Always use navbar height since we removed the banner
  return (
    <div className={`pt-20 ${className}`}>
      {children}
    </div>
  );
}