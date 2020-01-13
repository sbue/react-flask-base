import React from 'react';
import {Helmet} from 'react-helmet';

import {SITE_NAME} from 'config';
import {CSRF_ACCESS_TOKEN_KEY, CSRF_REFRESH_TOKEN_KEY} from 'utils/constants';
import Routes from 'routes';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {CheckAuth} from 'account/pages';

import GlobalStyle from 'global-styles';
import Cookies from 'js-cookie';

export default function App() {
  return (
    <div>
      <Helmet titleTemplate={`%s - ${SITE_NAME}`} defaultTitle={SITE_NAME} />
      <CheckAuth />
      <Header/>
      <main>
        <Routes />
      </main>
      <Footer />
      <GlobalStyle/>
    </div>
  );
}
