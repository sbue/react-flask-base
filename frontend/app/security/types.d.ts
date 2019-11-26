import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface SecurityState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = SecurityState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
