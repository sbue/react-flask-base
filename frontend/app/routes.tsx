import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Home, NotFound } from 'site/pages';
import { SignUp, Login, Logout, ForgotPassword, ResetPassword,
  PendingConfirmation, ConfirmEmail, Settings, ChangeEmail,
  ChangePassword, JoinInvite, UserDashboard,
} from 'account/pages';
import { AdminDashboard, ManageUsers, ManageUser, InviteUser } from 'admin/pages';
import { PrivateRoute, PublicRoute, RestrictedPublicRoute,
  AdminRoute, UnconfirmedEmailRoute } from 'components/Routes';
import {PATHS} from 'config';


/**
 * route details
 *
 * list of objects with keys:
 *  - key: component class name
 *  - path: the path for the component (in react router notation)
 *  - component: The component to use
 *  - routeComponent: PublicRoute, RestrictedPublicRoute, PrivateRoute, AdminRoute, or UnconfirmedEmailRoute
 */
const routes = [
  {
    key: 'Home',
    path: PATHS.Home,
    component: Home,
    routeComponent: PublicRoute,
  },
  // Account
  {
    key: 'Login',
    path: PATHS.Login,
    component: Login,
    routeComponent: RestrictedPublicRoute,
  },
  {
    key: 'ResetPassword',
    path: PATHS.ResetPassword,
    component: ResetPassword,
    routeComponent: RestrictedPublicRoute,
  },
  {
    key: 'ForgotPassword',
    path: PATHS.ForgotPassword,
    component: ForgotPassword,
    routeComponent: RestrictedPublicRoute,
  },
  {
    key: 'Logout',
    path: PATHS.Logout,
    component: Logout,
    routeComponent: PrivateRoute,
  },
  {
    key: 'SignUp',
    path: PATHS.SignUp,
    component: SignUp,
    routeComponent: RestrictedPublicRoute,
  },
  {
    key: 'JoinInvite',
    path: PATHS.JoinInvite,
    routeComponent: RestrictedPublicRoute,
    component: JoinInvite,
  },
  {
    key: 'PendingConfirmation',
    path: PATHS.PendingConfirmation,
    component: PendingConfirmation,
    routeComponent: UnconfirmedEmailRoute,
  },
  {
    key: 'ConfirmEmail',
    path: PATHS.ConfirmEmail,
    component: ConfirmEmail,
    routeComponent: UnconfirmedEmailRoute,
  },
  {
    key: 'Settings',
    path: PATHS.Settings,
    routeComponent: PrivateRoute,
    component: Settings,
  },
  {
    key: 'ChangeEmail',
    path: PATHS.ChangeEmail,
    routeComponent: PrivateRoute,
    component: ChangeEmail,
  },
  {
    key: 'ChangePassword',
    path: PATHS.ChangePassword,
    routeComponent: PrivateRoute,
    component: ChangePassword,
  },
  {
    key: 'UserDashboard',
    path: PATHS.UserDashboard,
    routeComponent: PrivateRoute,
    component: UserDashboard,
  },
  // Admin
  {
    key: 'AdminDashboard',
    path: PATHS.AdminDashboard,
    component: AdminDashboard,
    routeComponent: AdminRoute,
  },
  {
    key: 'ManageUsers',
    path: PATHS.ManageUsers,
    component: ManageUsers,
    routeComponent: AdminRoute,
  },
  {
    key: 'ManageUser',
    path: PATHS.ManageUser,
    component: ManageUser,
    routeComponent: AdminRoute,
  },
  {
    key: 'InviteUser',
    path: PATHS.InviteUser,
    component: InviteUser,
    routeComponent: AdminRoute,
  },
];

/**
 * ROUTE_MAP: A public lookup for route details by key
 */
export const ROUTE_MAP = {};
routes.forEach((route) => {
  const { component, key, path, routeComponent } = route;

  if (!component) {
    throw new Error(`component was not specified for the ${key} route!`);
  }
  if (!path) {
    throw new Error(`path was not specified for the ${key} route!`);
  }

  ROUTE_MAP[key] = {
    path,
    component,
    routeComponent: routeComponent || Route,
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

export function getPath(routeKey: string) {
  return ROUTE_MAP[routeKey].path;
}

export default () => (
  <Switch>
    {cachedRoutes}
  </Switch>
);
