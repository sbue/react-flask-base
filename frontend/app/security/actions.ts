import { createRoutine } from 'redux-saga-routines';

export const changeEmail = createRoutine('auth/CHANGE_EMAIL');
export const changePassword = createRoutine('auth/CHANGE_PASSWORD');
export const changeUserInfo = createRoutine('auth/CHANGE_USER_INFO');
export const checkAuth = createRoutine('auth/CHECK_AUTH');
export const confirmEmail = createRoutine('auth/CONFIRM_EMAIL');
export const deleteAccount = createRoutine('auth/DELETE_ACCOUNT');
export const forgotPassword = createRoutine('auth/FORGOT_PASSWORD');
export const joinInviteSetPassword = createRoutine('auth/JOIN_INVITE_SET_PASSWORD');
export const login = createRoutine('auth/LOGIN');
export const logout = createRoutine('auth/LOGOUT');
export const resendConfirmationEmail = createRoutine('auth/RESEND_CONFIRMATION_EMAIL');
export const resetPassword = createRoutine('auth/RESET_PASSWORD_BY_TOKEN');
export const signUp = createRoutine('auth/SIGN_UP');
