import { UserDeviceState } from '@/interfaces/user';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDeviceInfo, registerDevice } from '../services/userDeviceService';

const initialState: UserDeviceState = {
  isRegistering: false,
  isRegistered: false,
  error: null,
  lastRegisteredAt: null,
};

// Async thunk để đăng ký device
export const registerUserDevice = createAsyncThunk(
  'userDevice/registerDevice',
  async (_, { rejectWithValue }) => {
    try {
      const deviceInfo = await getDeviceInfo();
      const response = await registerDevice(deviceInfo);

      return response;
    } catch (error: any) {
      console.error(
        'Device registration failed:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      return rejectWithValue(error.message || 'Device registration failed');
    }
  },
);

const userDeviceSlice = createSlice({
  name: 'userDevice',
  initialState,
  reducers: {
    resetDeviceRegistration: (state) => {
      state.isRegistering = false;
      state.isRegistered = false;
      state.error = null;
      state.lastRegisteredAt = null;
    },
    clearDeviceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserDevice.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
      })
      .addCase(registerUserDevice.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.isRegistered = true;
        state.error = null;
        state.lastRegisteredAt = new Date().toISOString();
        console.log('Device registration completed in Redux');
      })
      .addCase(registerUserDevice.rejected, (state, action) => {
        state.isRegistering = false;
        state.isRegistered = false;
        state.error = action.payload as string;
        console.warn('Device registration failed in Redux:', action.payload);
      });
  },
});

export const { resetDeviceRegistration, clearDeviceError } = userDeviceSlice.actions;
export default userDeviceSlice.reducer;
