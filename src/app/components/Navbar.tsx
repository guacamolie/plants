
"use client";
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/">
        <span className="font-bold text-xl">Plant Shop</span>
      </Link>
      <div>
        {status === "loading" ? (
          <span>Loading...</span>
        ) : session ? (
          <>
            <span className="mr-4">Hello, {session.user?.name || session.user?.email}</span>
            <Link href="/api/auth/signout" className="btn">Sign out</Link>
          </>
        ) : (
          <>
            <Link href="/auth/signin" className="btn mr-2">Sign in</Link>
            <Link href="/auth/register" className="btn bg-gray-200 text-black">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
