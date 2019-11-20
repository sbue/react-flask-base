import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'security/reducer';

export const PublicRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};

export const RestrictedPublicRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return (
    <Route {...rest} render={props => (
      isAuthenticated ?
        <Redirect to="/" /> :
        <Component {...props} />
    )} />
  );
};

export const PrivateRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route {...rest} render={props => (
      isAuthenticated ?
        <Component {...props} /> :
        <Redirect to="/login" />
      )
    } />
  );
};
