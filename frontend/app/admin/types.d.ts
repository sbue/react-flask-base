import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface UserObject {
  key: string,
  firstName: string,
  lastName: string,
  email: string,
  role: string,
}

interface AdminState {
  users: Array<UserObject>,
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = AdminState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
