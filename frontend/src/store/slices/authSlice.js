import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedRole = localStorage.getItem("role");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  role: storedRole || null,
  loading: false,
  error: null,
  success: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    hydrate: (state) => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const user = localStorage.getItem("user");

      state.token = token || null;
      state.role = role || null;
      state.user = user ? JSON.parse(user) : null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload || {};

        const token =
          payload.token ||
          payload.accessToken ||
          payload.jwt ||
          "";

        const role =
          payload.role ||
          payload.user?.role ||
          "CANDIDATE";

        const user =
          payload.user ||
          payload;

        state.token = token;
        state.role = role;
        state.user = user;

        if (token) {
          localStorage.setItem("token", token);
        }

        if (role) {
          localStorage.setItem("role", role);
        }

        localStorage.setItem("user", JSON.stringify(user));
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success =
          action.payload?.message ||
          "Registration successful.";
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const {
  hydrate,
  clearAuthError,
  clearError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;