import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface UserObject {
  firstName: string,
  lastName: string,
  email: string,
  role: string,
  verifiedEmail: boolean,
  profilePhotoUrl: null | string;
}

interface AdminState {
  users: Record<string, UserObject>,
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = AdminState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
