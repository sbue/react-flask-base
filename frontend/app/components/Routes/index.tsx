import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'security/reducer';
import history from 'utils/history';
import {PATHS} from 'config';

export const PublicRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};

export const RestrictedPublicRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      history.push(PATHS.Home);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};

export const PrivateRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      history.push(PATHS.Login);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};
