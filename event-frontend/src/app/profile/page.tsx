"use client";

import Link from "next/link";
import { useRequireAuth } from "@/lib/useRequireAuth";

// import React from "react";

function ProfilePage() {
  const { user, ready } = useRequireAuth();

  if (!ready || !user) return null;
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow">
      {" "}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold uppercase text-indigo-700">
        {user.name.charAt(0)}
      </div>
      <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
      <p className="text-gray-500">{user.email}</p>
      <Link
        href="/events/new"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
        + Add Event
      </Link>
    </div>
  );
}

export default ProfilePage;
