import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import authService
  from "../../services/authService";

export const login =
  createAsyncThunk(
    "auth/login",
    async (
      credentials,
      thunkAPI
    ) => {
      try {
        return await authService.login(
          credentials
        );
      } catch (error) {
        return thunkAPI.rejectWithValue({
          status:
            error.response?.status,
          message:
            error.response?.data
              ?.message ||
            "Login failed"
        });
      }
    }
  );

export const register =
  createAsyncThunk(
    "auth/register",
    async (
      userData,
      thunkAPI
    ) => {
      try {
        return await authService.register(
          userData
        );
      } catch (error) {
        return thunkAPI.rejectWithValue({
          status:
            error.response?.status,
          message:
            error.response?.data
              ?.message ||
            "Registration failed"
        });
      }
    }
  );

const savedUser =
  localStorage.getItem("user");

let parsedUser = null;

try {
  parsedUser = savedUser
    ? JSON.parse(savedUser)
    : null;
} catch (error) {
  parsedUser = null;
}

const initialState = {
  token:
    localStorage.getItem(
      "token"
    ) || null,

  user: parsedUser,

  role:
    localStorage.getItem(
      "role"
    ) || null,

  isAuthenticated:
    !!localStorage.getItem(
      "token"
    ),

  loading: false,

  error: null
};

const authSlice =
  createSlice({
    name: "auth",

    initialState,

    reducers: {

      hydrate: (state) => {

        const token =
          localStorage.getItem(
            "token"
          );

        const role =
          localStorage.getItem(
            "role"
          );

        const user =
          localStorage.getItem(
            "user"
          );

        state.token =
          token || null;

        state.role =
          role || null;

        try {
          state.user =
            user
              ? JSON.parse(user)
              : null;
        } catch (error) {
          state.user = null;
        }

        state.isAuthenticated =
          !!token;
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

        localStorage.removeItem(
          "username"
        );

        state.token = null;

        state.user = null;

        state.role = null;

        state.isAuthenticated =
          false;

        state.loading = false;

        state.error = null;
      }
    },

    extraReducers:
      (builder) => {

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

              const data =
                action.payload || {};

              const token =
                data.token ||
                data.accessToken;

              const user =
                data.user || {
                  username:
                    data.username,
                  email:
                    data.email,
                  role:
                    data.role
                };

              const role =
                user?.role ||
                data.role ||
                null;

              state.token =
                token || null;

              state.user =
                user;

              state.role =
                role;

              state.isAuthenticated =
                !!token;

              /*
               * T25
               */
              if (token) {
                localStorage.setItem(
                  "token",
                  token
                );
              }

              /*
               * T26
               */
              localStorage.setItem(
                "role",
                role || ""
              );

              localStorage.setItem(
                "user",
                JSON.stringify(user)
              );

              localStorage.setItem(
                "username",
                user?.username || ""
              );
            }
          )

          .addCase(
            login.rejected,
            (state, action) => {

              state.loading = false;

              state.error =
                action.payload
                  ?.message ||
                "Login failed";
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
                action.payload
                  ?.message ||
                "Registration failed";
            }
          );
      }
  });

export const {
  hydrate,
  logout
} =
  authSlice.actions;

export default authSlice.reducer;