import { PagedResult } from './base';
import { Company } from './company';
import { TaskAssgin, UserTaskDashBoard } from './task';
import { UserLogResponse } from './user_log';

export interface UserStore {
  userName: string;
  refreshToken: string;
  accessToken: string;

  expired?: number;
  userId?: string;
  email?: string;
  avatar?: string;
  fullName?: string;

  phone?: string;
  address?: string;
  gender?: string;
  companies?: Company[];
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
