import { ContainerState, ContainerActions } from './types';
import {
  changePassword,
  login,
  logout,
  resetPassword,
  signUp,
} from 'security/actions';
export const initialState = {
  isAuthenticated: false,
  isAuthenticating: false,
  user: {
    firstName: '',
    lastName: '',
    email: '',
  },
};

export default function(state: ContainerState = initialState,
                        action: ContainerActions) {
  const { type, payload } = action;
  switch (type) {
    case login.REQUEST:
    case resetPassword.REQUEST:
    case signUp.REQUEST:
      return {
        ...state,
        isAuthenticating: true,
      };

    case login.SUCCESS:
    case resetPassword.SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user,
      };

    case login.FAILURE:
    case logout.SUCCESS:
    case logout.FAILURE:
    case logout.FULFILL:
    case resetPassword.FAILURE:
      return {
        ...state,
        isAuthenticated: false,
      };

    case login.FULFILL:
    case resetPassword.FULFILL:
    case signUp.FULFILL:
      return {
        ...state,
        isAuthenticating: false,
      };

    case changePassword.SUCCESS:
      return {
        ...state,
      };

    case signUp.SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: {
          ...state.user,
          ...payload.user,
        },
      };

    default:
      return state;
  }
}

export const selectSecurity = (state) => state.security;
export const selectIsAuthenticated = (state) => state.security.isAuthenticated;
