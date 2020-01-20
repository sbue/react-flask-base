import { createRoutine } from 'redux-saga-routines';

export const fetchUsers = createRoutine('admin/FETCH_USERS');
export const deleteUser = createRoutine('admin/DELETE_USER');
export const updateUser = createRoutine('admin/UPDATE_USER');
export const inviteUser = createRoutine('admin/INVITE_USER');
export const resendInvite = createRoutine('admin/RESEND_INVITE');
