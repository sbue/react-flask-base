import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useStore } from 'react-redux';

import { getInjectors } from './reducerInjectors';
import { InjectReducerParams, InjectedStore } from 'types';
import securityReducer from "../security/reducer";
import adminReducer from "../admin/reducer";

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */

export default function hocWithReducer<P>({
  key,
  reducer,
}: InjectReducerParams) {
  function wrap(
    WrappedComponent: React.ComponentType<P>,
  ): React.ComponentType<P> {
    // dont wanna give access to HOC. Child only
    class ReducerInjector extends React.Component<P> {
      public static WrappedComponent = WrappedComponent;
      public static displayName = `withReducer(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'})`;

      constructor(props: any, context: any) {
        super(props, context);

        getInjectors(context.store).injectReducer(key, reducer);
      }

      public render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    return hoistNonReactStatics(ReducerInjector, WrappedComponent) as any;
  }
  return wrap;
}

export const useInjectReducer = ({ key, reducer }: InjectReducerParams) => {
  const store = useStore() as InjectedStore;
  React.useEffect(() => {
    getInjectors(store).injectReducer(key, reducer);
  }, []);
};

export const useInjectAdminReducer = () =>
  useInjectReducer({ key: 'admin', reducer: adminReducer });
export const useInjectSecurityReducer = () =>
  useInjectReducer({ key: 'security', reducer: securityReducer });
