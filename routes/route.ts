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
  PARTNER: {
    DETAIL: '/(tabs)/home/company_detail/partners/partner_detail',
    ACTIVITY: '/(tabs)/home/company_detail/partners/partner_detail/activity',
    OVERVIEW: '/(tabs)/home/company_detail/partners/partner_detail/overview',
    PROJECT_REQUEST: '/(tabs)/home/company_detail/partners/partner_detail/project_request',
  },
  ACCOUNT: {
    INDEX: '/(tabs)/home/profile',
    SETTING: '/(tabs)/home/profile/setting',
    CHANGE_PASSWORD: '/(tabs)/home/profile/change_password',
    INFORMATION: '/(tabs)/home/profile/information',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    MAIN: '/auth',
    REQUIRE_EMAIL: '/auth/require_email',
  },
};
