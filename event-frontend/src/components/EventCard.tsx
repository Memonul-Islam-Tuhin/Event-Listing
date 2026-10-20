import { EventItem } from "@/types/event";
import Link from "next/link";
// import React from "react";

function EventCard({ event }: { event: EventItem }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.image}
        alt={event.title}
        className="h-48 w-full object-cover"
      />
      <div className="space-y-2 p-5">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          {event.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
          {event.title}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-500">
          {event.description}
        </p>
        <div className="flex items-center justify-between pt-2 text-sm text-gray-600">
          <span>📍{event.location}</span>
          <span>📅 {event.date}</span>
        </div>
        <p className="font-semibold text-gray-900">
          {event.price === 0 ? "Free" : `৳${event.price}`}
        </p>
      </div>
    </Link>
  );
}

export default EventCard;
