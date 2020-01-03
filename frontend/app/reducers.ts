/**
 * Combine all reducers in this file and export the combined reducers.
 */

import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import siteReducer from 'site/reducer';
import securityReducer from 'security/reducer';
import adminReducer from 'admin/reducer';
import history from 'utils/history';
import languageProviderReducer from 'components/LanguageProvider/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    language: languageProviderReducer,
    site: siteReducer,
    security: securityReducer,
    admin: adminReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });
}
