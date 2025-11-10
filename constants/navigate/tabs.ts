import { ROUTES } from '@/routes/route'; // hoặc đường dẫn đúng đến file ROUTES.ts

export const HOMETABS = [
  { name: 'home', iconName: 'home', title: 'Company', href: ROUTES.HOME.COMPANY },
  { name: 'schedule/index', iconName: 'clock', title: 'Schedule', href: ROUTES.HOME.SCHEDULE },
  {
    name: 'calendar',
    iconName: 'calendar',
    title: 'Calendar',
    href: ROUTES.HOME.CALENDAR,
  },
  {
    name: 'analytics/index',
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
];

export const PARTNERDETAILTABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'performance', label: 'Performance' },
  { key: 'project_request', label: 'Project Request' },
  { key: 'activity', label: 'Recent Activity' },
];

export const CompanyDetailTabs = ['Overview', 'Contact', 'Projects'];

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
