import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

export const fetchDrivers = createAsyncThunk(
  'drivers/fetchDrivers',
  async (_, { rejectWithValue }) => {
    try {
      const drivers = await api.getDrivers();
      return drivers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDriverById = createAsyncThunk(
  'drivers/fetchDriverById',
  async (driverId, { rejectWithValue }) => {
    try {
      const driver = await api.getDriverById(driverId);
      return driver;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const driversSlice = createSlice({
  name: 'drivers',
  initialState: {
    drivers: [],
    currentDriver: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDrivers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDrivers.fulfilled, (state, action) => {
      state.loading = false;
      state.drivers = action.payload;
    });
    builder.addCase(fetchDrivers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    builder.addCase(fetchDriverById.fulfilled, (state, action) => {
      state.currentDriver = action.payload;
    });
  },
});

export const { clearError } = driversSlice.actions;
export default driversSlice.reducer;