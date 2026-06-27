"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

// Define the type for the component props
interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}