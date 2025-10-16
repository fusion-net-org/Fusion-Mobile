export interface UserStore {
  userName: string;
  refreshToken: string;
  accessToken: string;

  expired?: number; // từ JWT exp
  userId?: string; // từ JWT sub
  email?: string; // từ JWT email
  avatar?: string; // URL avatar của user
  fullName?: string; // Tên đầy đủ của user
}

export interface RegisterUserDeviceRequest {
  DeviceToken: string;
  Platform: string; // "ANDROID" | "IOS" | "WEB"
  DeviceName?: string;
}

export interface UserDeviceState {
  isRegistering: boolean;
  isRegistered: boolean;
  error: string | null;
  lastRegisteredAt: string | null;
}
