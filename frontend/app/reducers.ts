/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { loadingBarReducer } from 'react-redux-loading-bar';
import formReducer from 'redux-form/es/reducer';

import securityReducer from 'security/reducer';
import history from 'utils/history';
import languageProviderReducer from 'containers/LanguageProvider/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    language: languageProviderReducer,
    loadingBar: loadingBarReducer,
    security: securityReducer,
    // flash: flashReducer,
    form: formReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
}
