"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import React, { Suspense } from "react";
import ProfileMenu from "./ProfileMenu";
import RouteProgress from "./RouteProgress";

function Navbar() {
  const { user, hydrated } = useAppSelector((s) => s.auth);
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Eventify
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {hydrated && user && (
            <Link
              href="/events/new"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              + Add Event
            </Link>
          )}

          {hydrated && !user && (
            <div className="hidden items-center gap-2 sm:flex ">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
          <ProfileMenu />
        </div>
      </nav>

      {/* Progress bar under the navbar */}
      <Suspense fallback={null}>
        <RouteProgress />
      </Suspense>
    </header>
  );
}

export default Navbar;
