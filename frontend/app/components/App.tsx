import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_NAME } from 'config';
import Routes from 'routes';
import Header from 'components/Header';
import Footer from 'components/Footer';
import PageContent from 'components/PageContent';

import GlobalStyle from 'global-styles';
export default function App() {
  return (
    <div>
      <Helmet titleTemplate={`%s - ${SITE_NAME}`} defaultTitle={SITE_NAME} />
      <Header/>
      <main>
        <PageContent>
          <Routes />
        </PageContent>
      </main>
      <Footer />
      <GlobalStyle/>
    </div>
  );
}
