import * as Cookies from 'js-cookie';
import {SITE_NAME} from 'config';
import {CSRF_ACCESS_TOKEN_KEY, CSRF_REFRESH_TOKEN_KEY} from 'utils/constants';

import { ContainerState, ContainerActions } from './types';
import {
  checkAuth, changeEmail, changeUserInfo, confirmEmail, deleteAccount, login, logout,
  resetPassword, signUp, joinInviteSetPassword, uploadProfilePhoto, deleteProfilePhoto,
} from 'account/actions';

const StoreKey = `${SITE_NAME}/accountState`;

export const emptyState: ContainerState = {
  isAuthenticated: false,
  user: {
    userID: '',
    role: '',
    verifiedEmail: false,
    firstName: '',
    lastName: '',
    email: '',
    profilePhoto: null,
  },
};

const haveTokens = Cookies.get(CSRF_ACCESS_TOKEN_KEY) &&
  Cookies.get(CSRF_REFRESH_TOKEN_KEY);
const localStore = localStorage.getItem(StoreKey);
const localStoreParsed = localStore ? JSON.parse(localStore) : {};
const initialState = haveTokens && localStoreParsed && localStoreParsed.user ?
  localStoreParsed : emptyState;

export default function(state: ContainerState = initialState,
                        action: ContainerActions) {
  const { type, payload } = action;
  let newState = {};
  switch (type) {
    case checkAuth.SUCCESS:
    case changeUserInfo.SUCCESS:
    case resetPassword.SUCCESS:
    case joinInviteSetPassword.SUCCESS:
    case login.SUCCESS:
    case signUp.SUCCESS:
      newState = {
        ...state,
        user: payload,
        isAuthenticated: true,
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

    case uploadProfilePhoto.SUCCESS:
      newState = {
        ...state,
        user: {
          ...state.user,
          profilePhoto: payload,
        }
      };
      localStorage.setItem(StoreKey, JSON.stringify(newState));
      return newState;

    case deleteProfilePhoto.SUCCESS:
      newState = {
        ...state,
        user: {
          ...state.user,
          profilePhoto: null,
        }
      };
      localStorage.setItem(StoreKey, JSON.stringify(newState));
      return newState;

    default:
      return state;
  }
}

export const selectUser = (state) => state.account.user;
export const selectFirstName = (state) => state.account.user.firstName;
export const selectEmail = (state) => state.account.user.email;
export const selectIsAuthenticated = (state) => state.account.isAuthenticated;
export const selectIsAdmin = (state) => state.account.user.role === 'Admin';
export const selectUnconfirmedEmail = (state) => state.account.isAuthenticated &&
  !state.account.user.verifiedEmail;
