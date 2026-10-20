"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function useRequireAuth() {
  const router = useRouter();
  const { user, token, hydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (hydrated && !user) router.push("/login");
  }, [hydrated, user, router]);

  return { user, token, ready: hydrated && !user };
}
