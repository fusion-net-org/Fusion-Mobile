import { PagedResult } from './base';
import { TaskAssgin, UserTaskDashBoard } from './task';
import { UserLogResponse } from './user_log';

export interface UserStore {
  userName: string;
  refreshToken: string;
  accessToken: string;

  expired?: number; // từ JWT exp
  userId?: string; // từ JWT sub
  email?: string; // từ JWT email
  avatar?: string; // URL avatar của user
  fullName?: string; // Tên đầy đủ của user

  phone?: string;
  address?: string;
  gender?: string;
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

export interface AnalyticsUserResponse {
  userPerformance: UserPerformance;
  assignToMe: TaskAssgin[];
  activityStream: PagedResult<UserLogResponse>;
  dashboard: UserTaskDashBoard;
}

export interface UserPerformance {
  totalTasksAssigned: number;
  totalCompanies: number;
  totalProjects: number;
  totalSubscriptions: number;
}
