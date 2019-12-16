import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin,
  selectUnconfirmedEmail } from 'security/reducer';
import history from 'utils/history';
import {PATHS} from 'config';


export const PublicRoute = ({component: Component, ...rest}) => {
  const unconfirmedEmail = useSelector(selectUnconfirmedEmail);
  useEffect(() => {
    if (unconfirmedEmail) history.push(PATHS.PendingConfirmation);
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
    if (unconfirmedEmail) history.push(PATHS.PendingConfirmation);
    if (isAuthenticated) history.push(PATHS.Home);
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
    if (!unconfirmedEmail) history.push(PATHS.Home);
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
    if (!isAuthenticated) history.push(PATHS.Login);
    if (!pathIsLogout && unconfirmedEmail) history.push(PATHS.PendingConfirmation);
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
  const unconfirmedEmail = useSelector(selectUnconfirmedEmail);
  useEffect(() => {
    if (unconfirmedEmail) history.push(PATHS.PendingConfirmation);
    if (!isAdmin) history.push(PATHS.Home);
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};
