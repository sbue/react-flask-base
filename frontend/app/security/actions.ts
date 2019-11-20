import { createRoutine } from 'redux-saga-routines';

export const changePassword = createRoutine('auth/CHANGE_PASSWORD');
export const forgotPassword = createRoutine('auth/FORGOT_PASSWORD');
export const login = createRoutine('auth/LOGIN');
export const logout = createRoutine('auth/LOGOUT');
export const refreshAccessToken = createRoutine('auth/REFRESH_ACCESS_TOKEN');
export const resendConfirmationEmail = createRoutine('auth/RESEND_CONFIRMATION_EMAIL');
export const resetPassword = createRoutine('auth/RESET_PASSWORD');
export const signUp = createRoutine('auth/SIGN_UP');
export const updateProfile = createRoutine('auth/UPDATE_PROFILE');
