import { ContainerState, ContainerActions } from './types';
import { changePassword, checkAuth, confirmEmail, login, logout,
  resetPassword, signUp} from 'security/actions';
import {SITE_NAME} from 'config';

const StoreKey = `${SITE_NAME}/securityState`;

export const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  verifiedEmail: false,
  firstName: '',
  lastName: '',
  email: '',
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
      console.log(payload);
      newState = {
        ...state,
        ...payload,
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

export const selectFirstName = (state) => state.security.firstName;
export const selectEmail = (state) => state.security.email;
export const selectIsAuthenticated = (state) => state.security.isAuthenticated;
export const selectIsAdmin = (state) => state.security.isAdmin;
export const selectVerifiedEmail = (state) => state.security.verifiedEmail;
