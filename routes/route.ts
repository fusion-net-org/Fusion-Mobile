export const ROUTES = {
  MEMBER: {
    DETAIL: '/(tabs)/home/company_detail/members/member_detail',
  },
  PROJECT: {
    REQUEST: '/(tabs)/home/company_detail/projects/project_detail_request',
    DETAIL: '/(tabs)/home/company_detail/projects/project_detail',
  },
  TICKET: {
    DETAIL: '/(tabs)/home/company_detail/projects/project_detail_request/ticket_detail',
  },
  PROJECT_REQUEST: {
    DETAIL: '/(tabs)/home/company_detail/project_requests/project_request_detail',
  },
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
    PROJECT_REQUESTS: '/(tabs)/home/company_detail/project_requests',
    TICKETS: '/(tabs)/home/company_detail/tickets',
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
  TASK: {
    CALENDAR_TASK: '/(tabs)/calendar/calendar_task_detail',
    ANALYTICS_TASK: '/(tabs)/analytics/analytic_task_detail',
    CALENDAR_TASK_LIST: '/(tabs)/calendar/calendar_list',
    TASK_DETAIL: '/(tabs)/home/company_detail/projects/project_detail/task_detail',
  },
};
