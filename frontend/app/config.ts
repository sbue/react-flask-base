
import { DEBUG } from 'utils/constants';

export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const isDev = !(isProd || isTest);

export const LOGGING_ENABLED = isDev;
export const LOG_LEVEL = DEBUG;

// set this if your API server is different from the frontend server
export const LOCAL_SERVER_URL = 'http://localhost:5000';
export const PROD_SERVER_URL = '<YOUR PROD SERVER HERE>';  // example: https://api.reactflaskbase.xyz
export const SERVER_URL = isProd ? PROD_SERVER_URL : LOCAL_SERVER_URL;

export const SITE_NAME = 'Flask React Base' + (isDev ? ' Dev' : '');
export const COPYRIGHT = 'Flask React Base' + (isDev ? ' Dev' : '');

export const ALLOW_REDUX_IN_PROD = true;

export const HIGHLIGHT_LANGUAGES = ['javascript', 'json', 'python', 'scss', 'yaml'];

export const ROLES = {
  User: 'User',
  Admin: 'Admin',
};

export const PATHS = {
  Home: '/',
  Login: '/login',
  ResetPassword: '/login/reset-password/:token',
  ForgotPassword: '/login/forgot-password',
  Logout: '/logout',
  SignUp: '/sign-up',
  JoinInvite: '/sign-up/join-from-invite/:token',
  PendingConfirmation: '/sign-up/pending-confirm-email',
  ConfirmEmail: '/sign-up/pending-confirm-email/:token',
  Settings: '/account/settings',
  ChangeEmail: '/account/settings/change-email',
  ChangePassword: '/account/settings/change-password',
  UserDashboard: '/account/dashboard',
  AdminDashboard: '/admin/dashboard',
  ManageUsers: '/admin/users',
  ManageUser: '/admin/users/:userID',
  InviteUser: '/admin/invite-user',
};
