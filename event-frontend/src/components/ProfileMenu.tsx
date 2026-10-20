"use client";

import { logoutUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const item = "block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50";

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function ProfileMenu() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, hydrated } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function handleLogout() {
    setOpen(false);
    await dispatch(logoutUser());
    router.push("/");
  }

  if (!hydrated) {
    return <div className="h-10 animate-pulse rounded-full bg-gray-200" />;
  }
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Profile menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 ring-2 ring-transparent transition hover:ring-indigo-300"
      >
        {user ? (
          <span className="text-sm font-semibold uppercase">
            {user.name.charAt(0)}
          </span>
        ) : (
          <UserIcon />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {user ? (
            <React.Fragment>
              <div className="border-b border-gray-200 px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className={`${item} text-gray-700`}
              >
                My Profile
              </Link>
              <Link
                href="/events/new"
                onClick={() => setOpen(false)}
                className={`${item} text-gray-700`}
              >
                Add Event
              </Link>
              <button
                onClick={handleLogout}
                className={`${item} border-t border-gray-200 text-red-600`}
              >
                Logout
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={`${item} text-gray-700`}
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className={`${item} text-gray-700`}
              >
                Register
              </Link>
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
