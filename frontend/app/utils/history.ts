import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export function goTo(path) {
  return () => history.push(path);
}

export default history;
