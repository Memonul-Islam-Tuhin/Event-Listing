"use client";

import EventCard from "@/components/EventCard";
import { categories } from "@/lib/constants";
import { fetchEvents, setCategory } from "@/store/eventsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, category, status, error } = useAppSelector((s) => s.events);
  const loading = status === "idle" || status === "loading";

  useEffect(() => {
    dispatch(fetchEvents(category));
  }, [dispatch, category]);
  return (
    <React.Fragment>
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Find your next event
        </h1>
        <p className="mt-2 text-gray-500">Browse upcoming events near you.</p>
      </section>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {[null, ...categories].map((c) => (
          <button
            key={c ?? "all"}
            onClick={() => dispatch(setCategory(c))}
            className={`rounded-full border border-gray-200 px-4 py-1.5 text-sm ${category === c ? "bg-indigo-600 text-white" : "bg-white hover:bg-gray-100"}`}
          >
            {c ?? "All"}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      ) : status === "failed" ? (
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => dispatch(fetchEvents(category))}
            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </React.Fragment>
  );
}
