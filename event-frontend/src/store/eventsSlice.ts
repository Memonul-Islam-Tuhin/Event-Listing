import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as api from "@/lib/api";
import { EventItem, NewEvent } from "@/types/event";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface EventsState {
  // list
  items: EventItem[];
  category: string | null;
  status: Status;
  error: string | null;
  // details page
  current: EventItem | null;
  currentStatus: Status;
  currentError: string | null;
  // create
  saving: boolean;
}

const initialState: EventsState = {
  items: [],
  category: null,
  status: "idle",
  error: null,
  current: null,
  currentStatus: "idle",
  currentError: null,
  saving: false,
};

const message = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

export const fetchEvents = createAsyncThunk<
  EventItem[],
  string | null,
  { rejectValue: string }
>("events/fetchAll", async (category, { rejectWithValue }) => {
  try {
    return await api.getEvents(category ?? undefined);
  } catch (e) {
    return rejectWithValue(message(e, "Failed to load events"));
  }
});

export const fetchEventById = createAsyncThunk<
  EventItem,
  string,
  { rejectValue: string }
>("events/fetchOne", async (id, { rejectWithValue }) => {
  try {
    return await api.getEvent(id);
  } catch (e) {
    return rejectWithValue(message(e, "Event not found"));
  }
});

export const createEvent = createAsyncThunk<
  EventItem,
  { data: NewEvent; token: string },
  { rejectValue: string }
>("events/create", async ({ data, token }, { rejectWithValue }) => {
  try {
    return await api.createEvent(data, token);
  } catch (e) {
    return rejectWithValue(message(e, "Failed to create event"));
  }
});

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string | null>) {
      state.category = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchEvents.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchEvents.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchEvents.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Failed to load events";
      })
      // details
      .addCase(fetchEventById.pending, (s) => {
        s.currentStatus = "loading";
        s.currentError = null;
        s.current = null;
      })
      .addCase(fetchEventById.fulfilled, (s, a) => {
        s.currentStatus = "succeeded";
        s.current = a.payload;
      })
      .addCase(fetchEventById.rejected, (s, a) => {
        s.currentStatus = "failed";
        s.currentError = a.payload ?? "Event not found";
      })
      // create
      .addCase(createEvent.pending, (s) => {
        s.saving = true;
      })
      .addCase(createEvent.fulfilled, (s, a) => {
        s.saving = false;
        s.items.unshift(a.payload);
      })
      .addCase(createEvent.rejected, (s) => {
        s.saving = false;
      });
  },
});

export const { setCategory } = eventsSlice.actions;
export default eventsSlice.reducer;
