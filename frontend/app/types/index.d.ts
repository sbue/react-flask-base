import { Reducer, Store } from 'redux';
import { RouterState } from 'connected-react-router';
import { ContainerState as LanguageProviderState } from 'components/LanguageProvider/types';
import { ContainerState as HomeState } from 'site/pages/Home/types';
import { ContainerState as SecurityState } from 'security/types';

// interface AppState {
//   readonly loading: boolean;
//   readonly error?: object | boolean;
//   readonly currentUser: string;
//   // readonly userData: UserData;
// }

export interface InjectedStore extends Store {
  injectedReducers: any;
  injectedSagas: any;
  runSaga(
    saga: (() => IterableIterator<any>) | undefined,
    args: any | undefined,
  ): any;
}

export interface InjectReducerParams {
  key: keyof ApplicationRootState;
  reducer: Reducer<any, any>;
}

export interface InjectSagaParams {
  key: keyof ApplicationRootState;
  saga: () => IterableIterator<any>;
  mode?: string | undefined;
}

// Your root reducer type, which is your redux state types also
export interface ApplicationRootState {
  readonly router: RouterState;
  // readonly global: AppState;
  readonly language: LanguageProviderState;
  readonly home: HomeState;
  readonly security: SecurityState;
  // for testing purposes
  readonly test: any;
}
