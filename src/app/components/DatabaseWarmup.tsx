"use client";

import { useDatabaseWarmup } from "@/app/hooks/useDatabaseWarmup";

export default function DatabaseWarmup() {
  // This will automatically warm up the database connection when the component mounts
  useDatabaseWarmup();
  
  // This component doesn't render anything visible
  return null;
}