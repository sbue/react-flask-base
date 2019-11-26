import { ContainerState, ContainerActions } from './types';
import {fetchUsers, deleteUser} from 'admin/actions';
export const initialState = {
  users: {},
  stale: false,
};

export default function(state: ContainerState = initialState,
                        action: ContainerActions) {
  const { type, payload } = action;
  switch (type) {
    case fetchUsers.SUCCESS:
      return {
        ...state,
        users: payload.users,
        stale: false,
      };
    case deleteUser.SUCCESS:
      return {
        ...state,
        stale: true,
      };
    default:
      return state;
  }
}

export const selectAdmin = (state) => state.admin;
