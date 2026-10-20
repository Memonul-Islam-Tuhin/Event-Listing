"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    if (hide.current) clearTimeout(hide.current);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setVisible(true);
    setProgress(10);

    tick.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.1 : p));
    }, 200);
  }, [clearTimers]);

  const done = useCallback(() => {
    clearTimers();
    setProgress(100);
    hide.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, [clearTimers]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    done();
  }, [pathname, searchParams, done]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;
      start();
    }
    window.addEventListener("route-progress:start", start);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("route-progress:start", start);
      document.removeEventListener("click", onClick);
      clearTimers();
    };
  }, [start, clearTimers]);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.75">
      <div
        className="h-full bg-indigo-600 transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}

export default RouteProgress;
