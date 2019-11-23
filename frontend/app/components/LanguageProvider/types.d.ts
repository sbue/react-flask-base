import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types/index';

/* --- STATE --- */

interface LanguageProviderState {
  readonly locale: string;
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = LanguageProviderState;
type ContainerActions = AppActions;

export { RootState, ContainerState, ContainerActions };
