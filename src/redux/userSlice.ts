import { UserStore } from '@/interfaces/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginData } from '../../interfaces/auth';
import { getUserById } from '../services/userService';
import { getJWTPayload } from '../utils/jwtHelper';

interface UserState {
  user: UserStore | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk để lấy thông tin user chi tiết
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getUserById(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user details');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<LoginData | UserStore>) => {
      // Kiểm tra xem đã có userId chưa (từ restore)
      if ('userId' in action.payload && action.payload.userId) {
        state.user = action.payload;
        AsyncStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        const loginData = action.payload as LoginData;
        const jwtPayload = getJWTPayload(loginData.accessToken);

        const user: UserStore = {
          userName: loginData.userName,
          accessToken: loginData.accessToken,
          refreshToken: loginData.refreshToken,
          userId: jwtPayload?.sub,
          email: jwtPayload?.email,
          expired: jwtPayload?.exp,
        };

        state.user = user;
        AsyncStorage.setItem('user', JSON.stringify(user))
          .then(() => console.log('✅ Saved user to storage:', user))
          .catch((err) => console.error('❌ Failed to save user:', err));
      }
    },

    logoutUser: (state) => {
      state.user = null;
      AsyncStorage.removeItem('user');
    },

    updateUserRedux: (state, action: PayloadAction<Partial<UserStore>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        AsyncStorage.setItem('user', JSON.stringify(state.user));
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          // Cập nhật thông tin user chi tiết
          const updatedUser = {
            ...state.user,
            fullName: action.payload.fullName || action.payload.name,
            avatar: action.payload.avatar || action.payload.avatarUrl,
            email: action.payload.email || state.user.email,
          } as UserStore;

          state.user = updatedUser;
          // Lưu vào AsyncStorage
          AsyncStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginUser, logoutUser, updateUserRedux, clearError } = userSlice.actions;
export default userSlice.reducer;
