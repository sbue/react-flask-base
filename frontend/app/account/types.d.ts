import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface AccountState {
  isAuthenticated: boolean;
  user: {
    userID: string,
    role: 'User' | 'Admin' | '';
    verifiedEmail: boolean;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: null | {
      url: string;
      file_name: string;
    }
  }
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = AccountState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
