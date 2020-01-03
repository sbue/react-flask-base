import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface SiteState {
  isLoading: boolean,
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = SiteState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
