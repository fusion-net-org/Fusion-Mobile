import { ROUTES } from '@/routes/route'; // hoặc đường dẫn đúng đến file ROUTES.ts

export const HOMETABS = [
  { name: 'home', iconName: 'home', title: 'Company', href: ROUTES.HOME.COMPANY },
  { name: 'workspace', iconName: 'laptop', title: 'Workspace', href: ROUTES.HOME.WORKSPACE },
  {
    name: 'calendar',
    iconName: 'calendar',
    title: 'Calendar',
    href: ROUTES.HOME.CALENDAR,
  },
  {
    name: 'analytics',
    iconName: 'chart-bar',
    title: 'Analytics',
    href: ROUTES.HOME.ANALYTICS,
  },
  {
    name: 'notification/index',
    iconName: 'bell',
    title: 'Notification',
    href: ROUTES.HOME.NOTIFICATION,
  },
];

export const COMPANYTABS = [
  { title: 'Detail', path: ROUTES.COMPANY.DETAIL, key: 'detail' },
  { title: 'Projects', path: ROUTES.COMPANY.PROJECTS, key: 'projects' },
  { title: 'Workflows', path: ROUTES.COMPANY.WORKFLOWS, key: 'workflows' },
  { title: 'Members', path: ROUTES.COMPANY.MEMBERS, key: 'members' },
  { title: 'Partners', path: ROUTES.COMPANY.PARTNERS, key: 'partners' },
  { title: 'Project Requests', path: ROUTES.COMPANY.PROJECT_REQUESTS, key: 'project_requests' },
  { title: 'Tickets', path: ROUTES.COMPANY.TICKETS, key: 'tickets' },
];

export const PARTNERDETAILTABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'performance', label: 'Performance' },
  { key: 'project_request', label: 'Project Request' },
  { key: 'activity', label: 'Recent Activity' },
];

export const CompanyDetailTabs = ['Overview', 'DashBoard', 'Projects', 'Contact'];

export const ProfileTabs = [
  { title: 'Information', icon: 'info-circle', path: ROUTES.ACCOUNT.INFORMATION },
  { title: 'Change Password', icon: 'lock', path: ROUTES.ACCOUNT.CHANGE_PASSWORD },
  { title: 'Settings', icon: 'cog', path: ROUTES.ACCOUNT.SETTING },
  { title: 'Log out', icon: 'sign-out-alt', path: 'Logout' },
];

export const CALENDAR_TABS = [
  { key: 'calendar_list', title: 'List' },
  { key: 'calendar', title: 'Calendar' },
];

export const ANALYTICSTABS = [
  { key: 'assign', label: 'Assigned To Me' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'activity', label: 'Activity Stream' },
];
