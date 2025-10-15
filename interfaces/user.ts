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
