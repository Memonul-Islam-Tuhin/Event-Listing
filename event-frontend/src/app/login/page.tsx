"use client";

import { inputClass } from "@/lib/styles";
import Link from "next/link";
import { clearAuthError, loginUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const result = await dispatch(
      loginUser({
        email: String(f.get("email")),
        password: String(f.get("password")),
      }),
    );
    if (loginUser.fulfilled.match(result)) {
      window.dispatchEvent(new Event("route-progress:start"));
      router.push("/");
    }
  }
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-gray-500">Login to your account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className={inputClass}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={status === "loading"}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        New here?{" "}
        <Link
          href="/register"
          className="font-medium text-indigo-600 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
