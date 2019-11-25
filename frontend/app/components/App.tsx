import React from 'react';
import {Helmet} from 'react-helmet';

import {SITE_NAME} from 'config';
import {CSRF_ACCESS_TOKEN_KEY, CSRF_REFRESH_TOKEN_KEY} from 'utils/constants';
import Routes from 'routes';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {CheckAuth} from 'security/pages';

import GlobalStyle from 'global-styles';
import Cookies from 'js-cookie';

export default function App() {

  const checkingAuth = (!!Cookies.get(CSRF_ACCESS_TOKEN_KEY) &&
                        !!Cookies.get(CSRF_REFRESH_TOKEN_KEY));
  return (
    <div>
      <Helmet titleTemplate={`%s - ${SITE_NAME}`} defaultTitle={SITE_NAME} />
      {checkingAuth && <CheckAuth />}
      <Header/>
      <main>
        <Routes />
      </main>
      <Footer />
      <GlobalStyle/>
    </div>
  );
}
