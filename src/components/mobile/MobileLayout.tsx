import { ReactNode } from "react";
import { MobileNavbar } from "./MobileNavbar";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto max-w-lg px-4 py-6">
        {children}
      </main>
      <MobileNavbar />
    </div>
  );
}
