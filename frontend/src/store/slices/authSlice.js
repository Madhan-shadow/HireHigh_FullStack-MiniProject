import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import authService
  from "../../services/authService";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      return await authService.login(
        credentials
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
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
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  }
);

const getUser = () => {
  const user =
    localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

const initialState = {
  token:
    localStorage.getItem("token"),

  role:
    localStorage.getItem("role"),

  user: getUser(),

  isAuthenticated:
    !!localStorage.getItem("token"),

  loading: false,

  error: null
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    hydrate: (state) => {
      state.token =
        localStorage.getItem("token");

      state.role =
        localStorage.getItem("role");

      state.user =
        getUser();

      state.isAuthenticated =
        !!state.token;
    },

    logout: (state) => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "user"
      );

      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
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

          const data =
            action.payload;

          state.token =
            data.token;

          state.user =
            data.user;

          state.role =
            data.user?.role;

          state.isAuthenticated =
            true;

          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "role",
            data.user?.role || ""
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );
        }
      )

      .addCase(
        login.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
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
            action.payload;
        }
      );
  }
});

export const {
  hydrate,
  logout
} = authSlice.actions;

export default authSlice.reducer;