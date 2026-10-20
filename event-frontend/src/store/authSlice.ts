import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as api from "@/lib/api";
import { AuthResponse, AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  status: "idle" | "loading";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  hydrated: false,
  status: "idle",
  error: null,
};

function persist(res: AuthResponse) {
  try {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
  } catch (error) {
    console.log("storage unavailable ", error);
  }
}

const message = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (body, { rejectWithValue }) => {
  try {
    const res = await api.loginUser(body);
    persist(res);
    return res;
  } catch (error) {
    return rejectWithValue(message(error, "Login failed"));
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (body, { rejectWithValue }) => {
  try {
    const res = await api.registerUser(body);
    persist(res);
    return res;
  } catch (error) {
    return rejectWithValue(message(error, "Registration failed"));
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.log("ignore", error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreSession(
      state,
      action: PayloadAction<{ token: string; user: AuthUser } | null>,
    ) {
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
      state.hydrated = true;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "idle";
        s.token = a.payload.token;
        s.user = a.payload.user;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "idle";
        s.error = a.payload ?? "Login failed";
      })
      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.status = "idle";
        s.token = a.payload.token;
        s.user = a.payload.user;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "idle";
        s.error = a.payload ?? "Registration failed";
      })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.token = null;
        s.error = null;
      });
  },
});

export const { restoreSession, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
