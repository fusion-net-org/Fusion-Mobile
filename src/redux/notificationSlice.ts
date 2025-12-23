import { NotificationState, SendNotificationRequest } from '@/interfaces/notification';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sendNotification } from '../services/notificationService';

const initialState: NotificationState = {
  isSending: false,
  isSent: false,
  error: null,
  lastSentAt: null,
};

// Async thunk: gửi thông báo
export const sendUserNotification = createAsyncThunk(
  'notification/send',
  async (payload: SendNotificationRequest, { rejectWithValue }) => {
    try {
      const response = await sendNotification(payload);
      return response;
    } catch (error: any) {
      console.error(
        '❌ Notification sending failed:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      return rejectWithValue(error.message || 'Notification sending failed');
    }
  },
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.isSending = false;
      state.isSent = false;
      state.error = null;
      state.lastSentAt = null;
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendUserNotification.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendUserNotification.fulfilled, (state, action) => {
        state.isSending = false;
        state.isSent = true;
        state.lastSentAt = new Date().toISOString();
        console.log('Notification sent successfully');
      })
      .addCase(sendUserNotification.rejected, (state, action) => {
        state.isSending = false;
        state.isSent = false;
        state.error = action.payload as string;
        console.warn(' Notification sending failed:', action.payload);
      });
  },
});

export const { resetNotificationState, clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
