import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const savedToken = localStorage.getItem("token");

let savedUser = null;

try {
  savedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );
} catch (error) {
  savedUser = null;
}

const initialState = {
  user: savedUser,
  token: savedToken || null,

  role:
    localStorage.getItem("role") ||
    savedUser?.role ||
    null,

  isAuthenticated: Boolean(savedToken),

  loading: false,

  error: null
};

export const login = createAsyncThunk(
  "auth/login",

  async (credentials, thunkAPI) => {
    try {
      const data =
        await authService.login(credentials);

      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt;

      const user =
        data?.user || data;

      const role =
        data?.role ||
        user?.role ||
        null;

      if (token) {
        localStorage.setItem(
          "token",
          token
        );
      }

      if (role) {
        localStorage.setItem(
          "role",
          role
        );
      }

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      return {
        ...data,
        token,
        user,
        role
      };

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
        error?.message ||
        "Login failed"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",

  async (userData, thunkAPI) => {
    try {

      return await authService.register(
        userData
      );

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",

  async () => {

    authService.logout();

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    return true;
  }
);

const authSlice = createSlice({

  name: "auth",

  initialState,

  reducers: {

    hydrate(state) {

      state.token =
        localStorage.getItem("token");

      state.role =
        localStorage.getItem("role");

      state.isAuthenticated =
        Boolean(state.token);

      try {

        state.user =
          JSON.parse(
            localStorage.getItem(
              "user"
            ) || "null"
          );

      } catch (error) {

        state.user = null;
      }
    },

    clearAuthError(state) {
      state.error = null;
    }
  },

  extraReducers: (builder) => {

    builder

      .addCase(
        login.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        login.fulfilled,
        (state, action) => {

          state.loading = false;
          state.error = null;

          state.token =
            action.payload.token ||
            state.token;

          state.role =
            action.payload.role ||
            state.role;

          state.user =
            action.payload.user ||
            state.user;

          state.isAuthenticated =
            Boolean(state.token);
        }
      )

      .addCase(
        login.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Login failed";

          state.isAuthenticated =
            false;
        }
      )

      .addCase(
        register.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        register.fulfilled,
        (state) => {

          state.loading = false;
          state.error = null;
        }
      )

      .addCase(
        register.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Registration failed";
        }
      )

      .addCase(
        logout.fulfilled,
        (state) => {

          state.user = null;
          state.token = null;
          state.role = null;

          state.isAuthenticated =
            false;
        }
      );
  }
});

export const {
  hydrate,
  clearAuthError
} = authSlice.actions;

export default authSlice.reducer;