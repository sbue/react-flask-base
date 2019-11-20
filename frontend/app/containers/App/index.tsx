/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignUp from 'security/pages/SignUp';

import GlobalStyle from 'global-styles';
export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/sign-up" component={SignUp} />
      </Switch>
      <GlobalStyle />
    </div>
  );
}
