
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import SessionProviderWrapper from "./SessionProviderWrapper";


export default function SetupGoogleSearchConsole() {
  return (
    <SessionProviderWrapper>
      <SearchConsoleSetup />
    </SessionProviderWrapper>
  );
}

function SearchConsoleSetup() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Google Search Console Setup</h1>

      {session ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold">✅ Connected as {session.user?.email}</p>
          <p className="text-sm text-gray-600 mt-2">You can now access Search Console data.</p>

          <a
            href="/dashboard/analytics"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Search Console
          </a>

          <button
            onClick={() => signOut()}
            className="mt-3 inline-block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold mb-2">🔴 Not Connected</p>
          <p className="text-sm text-gray-600">Please login to connect with Google Search Console.</p>

          <button
            onClick={() => signIn("google")}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Login with Google
          </button>
        </div>
      )}
    </div>
  );
}
