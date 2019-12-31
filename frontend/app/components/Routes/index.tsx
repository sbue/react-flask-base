import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin,
  selectUnconfirmedEmail } from 'security/reducer';
import history from 'utils/history';
import {PATHS} from 'config';
import { flashSuccess, flashWarning } from 'components/Flash';


export const PublicRoute = ({component: Component, ...rest}) => {
  const unconfirmedEmail = useSelector(selectUnconfirmedEmail);
  useEffect(() => {
    if (unconfirmedEmail) {
      flashWarning("Please confirm your email to access this page");
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
  const unconfirmedEmail = useSelector(selectUnconfirmedEmail);
  useEffect(() => {
    if (unconfirmedEmail) {
      flashWarning("Please confirm your email to access this page");
      history.push(PATHS.PendingConfirmation);
    }
    else if (isAuthenticated) {
      flashWarning("Please log out to access this page");
      history.push(PATHS.Home);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};

export const UnconfirmedEmailRoute = ({component: Component, ...rest}) => {
  const unconfirmedEmail = useSelector(selectUnconfirmedEmail);
  useEffect(() => {
    if (!unconfirmedEmail) {
      flashWarning("You\'ve already confirmed your email");
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
  const unconfirmedEmail = useSelector(selectUnconfirmedEmail);
  const pathIsLogout = history.location.pathname === PATHS.Logout;
  useEffect(() => {
    if (!isAuthenticated) {
      flashWarning("Please log in to access this page");
      history.push(PATHS.Login);
    }
    else if (!pathIsLogout && unconfirmedEmail) {
      flashWarning("Please confirm your email to access this page");
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
  const isAdmin = useSelector(selectIsAdmin);
  const unconfirmedEmail = useSelector(selectUnconfirmedEmail);
  useEffect(() => {
    if (isAdmin && unconfirmedEmail) {
      flashWarning("Please confirm your email to access this page");
      history.push(PATHS.PendingConfirmation);
    }
    else if (!isAdmin) {
      flashWarning("Please log in as an administrator to access this page");
      history.push(PATHS.Home);
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};
