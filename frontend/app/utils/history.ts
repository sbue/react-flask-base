import { createBrowserHistory } from 'history';
import { compile } from 'path-to-regexp';

const history = createBrowserHistory();

export const goTo = (path: string, params: object = {}) => {
  return () => history.push(compile(path)(params));
};

export default history;
