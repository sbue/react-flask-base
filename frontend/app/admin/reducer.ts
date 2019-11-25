import { ContainerState, ContainerActions } from './types';
import {fetchUsers} from 'admin/actions';
export const initialState = {
  users: [],
};

export default function(state: ContainerState = initialState,
                        action: ContainerActions) {
  const { type, payload } = action;
  switch (type) {
    case fetchUsers.SUCCESS:
      return {
        ...state,
        users: payload.users,
      };
    default:
      return state;
  }
}

export const selectUsers = (state) => state.admin.users;
