
import { DEBUG } from 'utils/constants';

export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const isDev = !(isProd || isTest);

export const LOGGING_ENABLED = isDev;
export const LOG_LEVEL = DEBUG;

export const SERVER_URL = 'http://localhost:5000'; // set this if your API server is different from the frontend server

export const SITE_NAME = 'Flask React Base';
export const COPYRIGHT = 'Flask React Base';

export const HIGHLIGHT_LANGUAGES = ['javascript', 'json', 'python', 'scss', 'yaml'];


export const PATHS = {
  // ForgotPassword: '/forgot-password',
  Home: '/',
  Login: '/login',
  Logout: '/logout',
  // PendingConfirmation: '/pending-confirmation',
  // ResendConfirmation: '/resend-confirmation',
  // ResetPassword: '/reset-password',
  SignUp: '/sign-up',
  Settings: '/settings',
  AdminDashboard: '/admin/dashboard',
  ManageUsers: '/admin/users',
};
