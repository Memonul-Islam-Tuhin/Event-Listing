"use client";

import { categories } from "@/lib/constants";
import { inputClass } from "@/lib/styles";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { createEvent } from "@/store/eventsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function NewEventPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.events.saving);
  const { token, ready } = useRequireAuth();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setError("");
    const f = new FormData(e.currentTarget);

    const result = await dispatch(
      createEvent({
        token,
        data: {
          title: String(f.get("title")),
          description: String(f.get("description")),
          location: String(f.get("location")),
          date: String(f.get("date")),
          category: String(f.get("category")),
          price: Number(f.get("price")),
        },
      }),
    );

    if (createEvent.fulfilled.match(result)) {
      router.push("/");
    } else {
      setError(result.payload ?? "Failed to create event");
    }
  }
  if (!ready) return null;
  return (
    <div className="">
      <h1 className="">Add new event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Event title"
          required
          className={inputClass}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          required
          className={inputClass}
        />
        <input
          name="location"
          placeholder="Location"
          required
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-4">
          <input name="date" type="date" required className={inputClass} />
          <input
            name="price"
            type="number"
            min="0"
            placeholder="Price (0 = free)"
            required
            className={inputClass}
          />
        </div>
        <select name="category" required className={inputClass}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={saving}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default NewEventPage;
