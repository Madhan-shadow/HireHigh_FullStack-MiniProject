import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const getSavedUser = () => {
  try {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: getSavedUser(),

  token: localStorage.getItem("token"),

  role: localStorage.getItem("role"),

  loading: false,

  error: null
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials) => {
    return await authService.login(credentials);
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData) => {
    return await authService.register(userData);
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout(state) {
      authService.logout();

      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
    },

    hydrate(state) {
      state.token = localStorage.getItem("token");

      state.role = localStorage.getItem("role");

      state.user = getSavedUser();
    }
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

        const payload = action.payload || {};

        const token =
          payload.token ||
          payload.accessToken ||
          localStorage.getItem("token");

        const user =
          payload.user ||
          payload;

        const role =
          payload.role ||
          user?.role ||
          localStorage.getItem("role") ||
          "CANDIDATE";

        state.token = token;
        state.user = user;
        state.role = role;

        if (token) {
          localStorage.setItem("token", token);
        }

        if (role) {
          localStorage.setItem("role", role);
        }

        if (user) {
          localStorage.setItem(
            "user",
            JSON.stringify(user)
          );
        }
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.error?.message ||
          "Login failed";
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload || {};

        if (payload.token) {
          state.token = payload.token;

          localStorage.setItem(
            "token",
            payload.token
          );
        }

        if (payload.user) {
          state.user = payload.user;

          state.role =
            payload.user.role ||
            "CANDIDATE";

          localStorage.setItem(
            "user",
            JSON.stringify(payload.user)
          );

          localStorage.setItem(
            "role",
            state.role
          );
        }
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.error?.message ||
          "Registration failed";
      });
  }
});

export const {
  logout,
  hydrate
} = authSlice.actions;

export default authSlice.reducer;