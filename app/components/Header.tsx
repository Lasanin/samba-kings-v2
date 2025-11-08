'use client';

import Link from "next/link";

export default function Header({ session }: { session: any }) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="space-x-3">
        <Link className="btn" href="/">Samba Kings</Link>
        {session?.user && (
          <>
            <Link className="btn" href="/admin">Admin</Link>
            <span className="text-sm opacity-70">{session.user.email}</span>
          </>
        )}
      </div>
      {!session?.user && <Link className="btn" href="/login">Přihlásit</Link>}
    </header>
  );
}
