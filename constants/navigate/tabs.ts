import { ROUTES } from '@/routes/route'; // hoặc đường dẫn đúng đến file ROUTES.ts

export const HOMETABS = [
  { name: 'home', iconName: 'home', title: 'Company', href: ROUTES.HOME.COMPANY },
  { name: 'schedule/index', iconName: 'clock', title: 'Schedule', href: ROUTES.HOME.SCHEDULE },
  { name: 'calendar/index', iconName: 'calendar', title: 'Calendar', href: ROUTES.HOME.CALENDAR },
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
  { key: 'activity', label: 'Activity' },
  { key: 'project_request', label: 'Project Request' },
];

export const CompanyDetailTabs = ['Overview', 'Contact', 'Projects'];
