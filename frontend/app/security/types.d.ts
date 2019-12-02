import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface SecurityState {
  isAuthenticated: boolean;
  user: {
    userID: string,
    role: 'Anonymous' | 'User' | 'Admin';
    verifiedEmail: boolean;
    firstName: string;
    lastName: string;
    email: string;
  }
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = SecurityState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
