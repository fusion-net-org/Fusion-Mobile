export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  userName: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUserDeviceRequest {
  deviceToken: string;
  platform: string;
  deviceName: string;
}
