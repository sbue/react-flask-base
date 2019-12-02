import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin, selectVerifiedEmail } from 'security/reducer';
import history from 'utils/history';
import {PATHS} from 'config';

export const PublicRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const verifiedEmail = useSelector(selectVerifiedEmail);
  useEffect(() => {
    if (isAuthenticated && !verifiedEmail) {
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
  const isAuthenticated = useSelector(selectVerifiedEmail);
  const verifiedEmail = useSelector(selectVerifiedEmail);
  useEffect(() => {
    if (isAuthenticated && verifiedEmail) {
      history.push(PATHS.Home);
    } else if (isAuthenticated && !verifiedEmail) {
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
  const verifiedEmail = useSelector(selectVerifiedEmail);
  useEffect(() => {
    if (!(isAuthenticated && !verifiedEmail)) {
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
  const verifiedEmail = useSelector(selectVerifiedEmail);
  const pathIsLogout = history.location.pathname === PATHS.Logout;
  useEffect(() => {
    if (!isAuthenticated) {
      history.push(PATHS.Login);
    } else if (!verifiedEmail && !pathIsLogout) {
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
  const verifiedEmail = useSelector(selectVerifiedEmail);
  useEffect(() => {
    if (!(isAuthenticated && isAdmin)) {
      history.push(PATHS.Home);
    } else if (!verifiedEmail) {
      history.push(PATHS.PendingConfirmation);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};
