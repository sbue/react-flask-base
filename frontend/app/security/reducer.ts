import { ContainerState, ContainerActions } from './types';
import { checkAuth, changeEmail, changeUserInfo, confirmEmail, deleteAccount,
  login, logout, resetPassword, signUp} from 'security/actions';
import {SITE_NAME} from 'config';

const StoreKey = `${SITE_NAME}/securityState`;

export const emptyState: ContainerState = {
  isAuthenticated: false,
  user: {
    userID: '',
    role: '',
    verifiedEmail: false,
    firstName: '',
    lastName: '',
    email: '',
  },
};

const localStore = localStorage.getItem(StoreKey);
const localStoreParsed = localStore ? JSON.parse(localStore) : {};
const initialState = localStoreParsed && localStoreParsed.user ?
  localStoreParsed : emptyState;

export default function(state: ContainerState = initialState,
                        action: ContainerActions) {
  const { type, payload } = action;
  let newState = {};
  switch (type) {
    case checkAuth.SUCCESS:
    case changeUserInfo.SUCCESS:
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
        user: {
          ...state.user,
          verifiedEmail: true,
        }
      };
      localStorage.setItem(StoreKey, JSON.stringify(newState));
      return newState;

    case changeEmail.SUCCESS:
      newState = {
        ...state,
        user: {
          ...state.user,
          email: payload.newEmail,
          // verifiedEmail: false,  // Seems odd to lock the user out immediately
        }
      };
      localStorage.setItem(StoreKey, JSON.stringify(newState));
      return newState;

    case checkAuth.FAILURE:
    case login.FAILURE:
    case logout.FULFILL:
    case resetPassword.FAILURE:
    case signUp.FAILURE:
    case deleteAccount.SUCCESS:
      localStorage.removeItem(StoreKey);
      return emptyState;

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
