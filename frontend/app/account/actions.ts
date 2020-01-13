import { createRoutine } from 'redux-saga-routines';

export const changeEmail = createRoutine('account/CHANGE_EMAIL');
export const changePassword = createRoutine('account/CHANGE_PASSWORD');
export const changeUserInfo = createRoutine('account/CHANGE_USER_INFO');
export const checkAuth = createRoutine('account/CHECK_AUTH');
export const confirmEmail = createRoutine('account/CONFIRM_EMAIL');
export const deleteAccount = createRoutine('account/DELETE_ACCOUNT');
export const deleteProfilePhoto = createRoutine('account/DELETE_PROFILE_PHOTO');
export const forgotPassword = createRoutine('account/FORGOT_PASSWORD');
export const joinInviteSetPassword = createRoutine('account/JOIN_INVITE_SET_PASSWORD');
export const login = createRoutine('account/LOGIN');
export const logout = createRoutine('account/LOGOUT');
export const resendConfirmationEmail = createRoutine('account/RESEND_CONFIRMATION_EMAIL');
export const resetPassword = createRoutine('account/RESET_PASSWORD_BY_TOKEN');
export const signUp = createRoutine('account/SIGN_UP');
export const uploadProfilePhoto = createRoutine('account/UPLOAD_PROFILE_PHOTO');
