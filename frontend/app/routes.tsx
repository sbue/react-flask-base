import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Home, NotFound } from 'site/pages';
import { SignUp, Login, Logout } from 'security/pages';
import { PrivateRoute, PublicRoute, RestrictedPublicRoute } from 'components/Routes';

import startCase from 'lodash/startCase';
import { compile } from 'path-to-regexp';


/**
 * ROUTES: The canonical store of frontend routes. Routes throughout the system
 * should be referenced using these constants
 *
 * Both keys and values are component class names
 */
export const ROUTES = {
  // Contact: 'Contact',
  // ForgotPassword: 'ForgotPassword',
  Home: 'Home',
  Login: 'Login',
  Logout: 'Logout',
  // PendingConfirmation: 'PendingConfirmation',
  // ResendConfirmation: 'ResendConfirmation',
  // ResetPassword: 'ResetPassword',
  SignUp: 'SignUp',
};

/**
 * route details
 *
 * list of objects with keys:
 *  - key: component class name
 *  - path: the path for the component (in react router notation)
 *  - component: The component to use
 *  - routeComponent: optional, AnonymousRoute, ProtectedRoute or Route (default: Route)
 *  - label: optional, label to use for links (default: startCase(key))
 */
const routes = [
  // {
  //   key: ROUTES.ForgotPassword,
  //   path: '/login/forgot-password',
  //   component: ForgotPassword,
  //   routeComponent: AnonymousRoute,
  //   label: 'Forgot password?',
  // },
  {
    key: ROUTES.Home,
    path: '/',
    component: Home,
    routeComponent: PublicRoute,
  },
  {
    key: ROUTES.Login,
    path: '/login',
    component: Login,
    routeComponent: RestrictedPublicRoute,
    label: 'Login',
  },
  {
    key: ROUTES.Logout,
    path: '/logout',
    component: Logout,
    routeComponent: PrivateRoute,
    label: 'Logout',
  },
  // {
  //   key: ROUTES.PendingConfirmation,
  //   path: '/sign-up/pending-confirm-email',
  //   component: PendingConfirmation,
  //   routeComponent: AnonymousRoute,
  //   label: 'Pending Confirm Email',
  // },
  // {
  //   key: ROUTES.ResendConfirmation,
  //   path: '/sign-up/resend-confirmation-email',
  //   component: ResendConfirmation,
  //   routeComponent: AnonymousRoute,
  //   label: 'Resend Confirmation Email',
  // },
  // {
  //   key: ROUTES.ResetPassword,
  //   path: '/login/reset-password/:token',
  //   component: ResetPassword,
  //   routeComponent: AnonymousRoute,
  //   label: 'Reset Password',
  // },
  {
    key: ROUTES.SignUp,
    path: '/sign-up',
    component: SignUp,
    routeComponent: RestrictedPublicRoute,
    label: 'Sign Up',
  },
];

/**
 * ROUTE_MAP: A public lookup for route details by key
 */
export const ROUTE_MAP = {};
routes.forEach((route) => {
  const { component, key, label, path, routeComponent } = route;

  if (!component) {
    throw new Error(`component was not specified for the ${key} route!`);
  }
  if (!path) {
    throw new Error(`path was not specified for the ${key} route!`);
  }

  ROUTE_MAP[key] = {
    path,
    toPath: compile(path),
    component,
    routeComponent: routeComponent || Route,
    label: label || startCase(key),
  };
});


/**
 * React Router 4 re-renders all child components of Switch statements on
 * every page change. Therefore, we render routes ahead of time once.
 */
const cachedRoutes = routes.map((route) => {
  const { component, path, routeComponent: RouteComponent } = ROUTE_MAP[route.key];
  return <RouteComponent exact path={path} component={component} key={path} />;
});
cachedRoutes.push(<Route component={NotFound} key="*" />);

export default () => (
  <Switch>
    {cachedRoutes}
  </Switch>
);
