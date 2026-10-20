"use client";

import { restoreSession } from "@/store/authSlice";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/store/store";
import React, { useEffect, useRef } from "react";

function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    let session: {
      token: string;
      user: {
        id: number;
        name: string;
        email: string;
      };
    } | null = null;

    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData && userData !== "undefined") {
        const user = JSON.parse(userData);

        if (
          user &&
          typeof user.id === "number" &&
          typeof user.name === "string" &&
          typeof user.email === "string"
        ) {
          session = {
            token,
            user,
          };
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    storeRef.current!.dispatch(restoreSession(session));
  }, []);

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current!}>{children}</Provider>;
}

export default StoreProvider;
