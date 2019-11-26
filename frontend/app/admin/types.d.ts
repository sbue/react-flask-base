import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface UserObject {
  name: string,
  email: string,
  role: string,
}

interface AdminState {
  users: Record<string, UserObject>,
  stale: boolean,
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = AdminState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
