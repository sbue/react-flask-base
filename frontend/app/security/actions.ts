import { createRoutine } from 'redux-saga-routines';

export const changePassword = createRoutine('auth/CHANGE_PASSWORD');
export const forgotPassword = createRoutine('auth/FORGOT_PASSWORD');
export const checkAuth = createRoutine('auth/CHECK_AUTH');
export const login = createRoutine('auth/LOGIN');
export const logout = createRoutine('auth/LOGOUT');
export const resendConfirmationEmail = createRoutine('auth/RESEND_CONFIRMATION_EMAIL');
export const resetPassword = createRoutine('auth/RESET_PASSWORD');
export const resetPasswordByToken = createRoutine('auth/RESET_PASSWORD_BY_TOKEN');
export const signUp = createRoutine('auth/SIGN_UP');
