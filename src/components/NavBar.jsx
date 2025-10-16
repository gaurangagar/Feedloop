"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Left side links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-semibold text-lg">
          Home
        </Link>
        <Link href="/create-order" className="text-gray-600 hover:text-black">
          Create Order
        </Link>
        <Link href="/dashboard" className="text-gray-600 hover:text-black">
          DashBoard
        </Link>
      </div>

      {/* Right side auth */}
      <div>
        {session && session.user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{session.user.email}</span>
            <Button variant="destructive" onClick={() => signOut()}>
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in" className="text-gray-600 hover:text-black">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
