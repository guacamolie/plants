import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/">
        <span className="font-bold text-xl">Plant Shop</span>
      </Link>
      <div>
        {session ? (
          <>
            <span className="mr-4">Hello, {session.user?.name}</span>
            <Link href="/api/auth/signout" className="btn">Sign out</Link>
          </>
        ) : (
          <>
            <Link href="/api/auth/signin" className="btn mr-2">Sign in</Link>
            <Link href="/register" className="btn bg-gray-200 text-black">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
