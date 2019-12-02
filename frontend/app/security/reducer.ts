import { ContainerState, ContainerActions } from './types';
import { checkAuth, confirmEmail, login, logout,
  resetPassword, signUp} from 'security/actions';
import {SITE_NAME} from 'config';

const StoreKey = `${SITE_NAME}/securityState`;

export const initialState: ContainerState = {
  isAuthenticated: false,
  user: {
    userID: '',
    role: 'Anonymous',
    verifiedEmail: false,
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
  let newState = {};
  switch (type) {
    case checkAuth.SUCCESS:
    case resetPassword.SUCCESS:
    case login.SUCCESS:
    case signUp.SUCCESS:
      newState = {
        ...state,
        user: payload,
        isAuthenticated: true,
      };
      localStorage.setItem(StoreKey, JSON.stringify(newState));
      return newState;

    case confirmEmail.SUCCESS:
      newState = {
        ...state,
        verifiedEmail: true,
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

export const selectUser = (state) => state.security.user;
export const selectFirstName = (state) => state.security.user.firstName;
export const selectEmail = (state) => state.security.user.email;
export const selectIsAuthenticated = (state) => state.security.isAuthenticated;
export const selectIsAdmin = (state) => state.security.user.role === 'Admin';
export const selectVerifiedEmail = (state) => state.security.user.verifiedEmail;
