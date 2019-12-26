import { createRoutine } from 'redux-saga-routines';

export const fetchUsers = createRoutine('auth/FETCH_USERS');
export const deleteUser = createRoutine('auth/DELETE_USER');
export const updateUser = createRoutine('auth/UPDATE_USER');
export const inviteUser = createRoutine('auth/INVITE_USER');
