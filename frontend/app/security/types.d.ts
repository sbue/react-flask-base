import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface SecurityState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isAdmin: boolean;
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = SecurityState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
