import { ContainerState, ContainerActions } from './types';
import {
  changePassword,
  checkAuth,
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
  isAdmin: false,
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

    case checkAuth.SUCCESS:
    case login.SUCCESS:
    case signUp.SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: {
          ...state.user,
          ...payload.user,
        },
        isAdmin: payload.isAdmin,
      };

    case login.FAILURE:
    case logout.FULFILL:
    case resetPassword.FAILURE:
    case signUp.FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: initialState.user,
      };

    case login.FULFILL:
    case resetPassword.FULFILL:
    case signUp.FULFILL:
      return {
        ...state,
        isAuthenticating: false,
      };

    default:
      return state;
  }
}

export const selectSecurity = (state) => state.security;
export const selectIsAuthenticated = (state) => state.security.isAuthenticated;
export const selectIsAdmin = (state) => state.security.isAdmin;
