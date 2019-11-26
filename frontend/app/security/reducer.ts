import { ContainerState, ContainerActions } from './types';
import {
  changePassword,
  checkAuth,
  login,
  logout,
  resetPassword,
  signUp,
  resetPasswordByToken,
} from 'security/actions';
import {SITE_NAME} from 'config';

const StoreKey = `${SITE_NAME}/securityState`;

export const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  isConfirmedByEmail: false,
  user: {
    firstName: '',
    lastName: '',
    email: '',
  },
};

const localStore = localStorage.getItem(StoreKey);
const startState = localStore ? JSON.parse(localStore) : initialState;

export default function(state: ContainerState = startState,
                        action: ContainerActions) {
  const { type, payload } = action;
  switch (type) {
    case checkAuth.SUCCESS:
    case resetPasswordByToken.SUCCESS:
    case login.SUCCESS:
    case signUp.SUCCESS:
      const newState = {
        ...state,
        isAuthenticated: true,
        isAdmin: payload.isAdmin,
        user: {
          ...state.user,
          ...payload.user,
        },
      };
      localStorage.setItem(StoreKey, JSON.stringify(newState));
      return newState;

    case checkAuth.FAILURE:
    case login.FAILURE:
    case logout.FULFILL:
    case resetPassword.FAILURE:
    case signUp.FAILURE:
      localStorage.removeItem(StoreKey);
      return initialState;

    default:
      return state;
  }
}

export const selectSecurity = (state) => state.security;
export const selectIsAuthenticated = (state) => state.security.isAuthenticated;
export const selectIsAdmin = (state) => state.security.isAdmin;
export const selectIsConfirmedByEmail = (state) => state.security.isConfirmedByEmail;
