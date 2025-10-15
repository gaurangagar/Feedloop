'use client';
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function NavBarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname?.startsWith("/feedback/"); // hide on feedback pages

  return (
    <>
      {!hideNav && <NavBar />}
      {children}
    </>
  );
}
