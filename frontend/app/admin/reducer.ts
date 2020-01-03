import _ from 'lodash';
import { ContainerState, ContainerActions } from './types';
import {fetchUsers, deleteUser, updateUser} from 'admin/actions';

export const initialState = {
  users: {},
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
    case deleteUser.SUCCESS:
      return {
        ...state,
        users: _.omit(state.users, payload.userID),
      };
    case updateUser.SUCCESS:
      const {userID, user} = payload;
      return {
        ...state,
        users: {...state.users, ...{[userID]: user}},
      };
    default:
      return state;
  }
}

export const selectAdmin = (state) => state.admin;
