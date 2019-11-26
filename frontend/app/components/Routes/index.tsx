import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin, selectIsConfirmedByEmail } from 'security/reducer';
import history from 'utils/history';
import {PATHS} from 'config';

export const PublicRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isConfirmedByEmail = useSelector(selectIsConfirmedByEmail);
  useEffect(() => {
    if (isAuthenticated && !isConfirmedByEmail) {
      history.push(PATHS.PendingConfirmation);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};

export const RestrictedPublicRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isConfirmedByEmail = useSelector(selectIsConfirmedByEmail);
  useEffect(() => {
    if (isAuthenticated && isConfirmedByEmail) {
      history.push(PATHS.Home);
    } else if (isAuthenticated && !isConfirmedByEmail) {
      history.push(PATHS.PendingConfirmation);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};

export const UnconfirmedEmailRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isConfirmedByEmail = useSelector(selectIsConfirmedByEmail);
  useEffect(() => {
    if (!(isAuthenticated && !isConfirmedByEmail)) {
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
  const isConfirmedByEmail = useSelector(selectIsConfirmedByEmail);
  useEffect(() => {
    if (!isAuthenticated) {
      history.push(PATHS.Login);
    } else if (!isConfirmedByEmail) {
      history.push(PATHS.PendingConfirmation);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};

export const AdminRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const isConfirmedByEmail = useSelector(selectIsConfirmedByEmail);
  useEffect(() => {
    if (!(isAuthenticated && isAdmin)) {
      history.push(PATHS.Home);
    } else if (!isConfirmedByEmail) {
      history.push(PATHS.PendingConfirmation);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};
