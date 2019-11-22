import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'security/reducer';
import history from 'utils/history';

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
      history.push('/');
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
      history.push('/login');
    }
  }, []);
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};
