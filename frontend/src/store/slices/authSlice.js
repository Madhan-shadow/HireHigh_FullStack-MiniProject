import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import authService
  from "../../services/authService";

/*
 * LOGIN
 */
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

/*
 * REGISTER
 */
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

/*
 * Read saved user safely.
 */
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

/*
 * Initial Redux state.
 */
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

      /*
       * Restore authentication from
       * localStorage.
       */
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

      /*
       * T27 + T28
       *
       * Logout clears both localStorage
       * and Redux state.
       */
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

          /*
           * LOGIN PENDING
           */
          .addCase(
            login.pending,
            (state) => {
              state.loading = true;
              state.error = null;
            }
          )

          /*
           * LOGIN SUCCESS
           *
           * T25 token persistence
           * T26 role persistence
           * T29 Redux state population
           */
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

          /*
           * LOGIN FAILED
           */
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

          /*
           * REGISTER PENDING
           */
          .addCase(
            register.pending,
            (state) => {

              state.loading = true;
              state.error = null;
            }
          )

          /*
           * REGISTER SUCCESS
           */
          .addCase(
            register.fulfilled,
            (state) => {

              state.loading = false;
              state.error = null;
            }
          )

          /*
           * REGISTER FAILED
           */
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
} = authSlice.actions;

export default authSlice.reducer;