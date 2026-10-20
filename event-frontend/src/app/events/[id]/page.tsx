"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEventById } from "@/store/eventsSlice";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { current, currentStatus, currentError } = useAppSelector(
    (s) => s.events,
  );

  useEffect(() => {
    if (id) dispatch(fetchEventById(id));
  }, [dispatch, id]);

  if (currentStatus === "failed") {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <p className="font-medium text-red-600">{currentError}</p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            onClick={() => dispatch(fetchEventById(id))}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  if (currentStatus !== "succeeded" || !current || String(current.id) !== id) {
    return (
      <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl bg-gray-200" />
    );
  }

  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.image}
        alt={current.title}
        className="h-72 w-full object-cover"
      />
      <div className="space-y-4 p-8">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          {current.category}
        </span>
        <h1 className="text-3xl font-bold">{current.title}</h1>
        <div className="flex flex-wrap gap-6 text-gray-600">
          <span>📍 {current.location}</span>
          <span>📅 {current.date}</span>
          <span>💰 {current.price === 0 ? "Free" : `৳${current.price}`}</span>
        </div>
        <p className="leading-relaxed text-gray-700">{current.description}</p>
        <Link href="/" className="inline-block text-indigo-600 hover:underline">
          ← Back to events
        </Link>
      </div>
    </article>
  );
}
