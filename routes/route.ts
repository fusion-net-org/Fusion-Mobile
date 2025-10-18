export const ROUTES = {
  HOME: {
    COMPANY: '/(tabs)/home',
    SCHEDULE: '/(tabs)/schedule',
    CALENDAR: '/(tabs)/calendar',
    ANALYTICS: '/(tabs)/analytics',
    NOTIFICATION: '/(tabs)/notification',
  },
  COMPANY: {
    DETAIL: '/(tabs)/home/company_detail/detail',
    MEMBERS: '/(tabs)/home/company_detail/members',
    PARTNERS: '/(tabs)/home/company_detail/partners',
    PROJECTS: '/(tabs)/home/company_detail/projects',
    WORKFLOWS: '/(tabs)/home/company_detail/workflows',
  },
  ACCOUNT: {
    INDEX: '/(tabs)/home/profile',
    NOTIFICATION_SETTING: '/(tabs)/home/profile/notification_setting',
    CHANGE_PASSWORD: '/(tabs)/home/profile/change_password',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    MAIN: '/auth',
  },
};
