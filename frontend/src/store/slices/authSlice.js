import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../../services/authService';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginApi(credentials); // { token, user: { role, ... } }
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    return await registerApi(userData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.status = 'succeeded';
        state.token = token;
        state.user = user;
        state.role = user.role;

        // T25 & T26 — this is the part your tests are checking
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;