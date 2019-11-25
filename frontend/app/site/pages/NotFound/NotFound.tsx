/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PageContent from 'components/PageContent';
import messages from './messages';

export default function NotFound() {
  return (
    <PageContent>
      <article>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
      </article>
    </PageContent>
  );
}
