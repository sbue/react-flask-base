import { url } from 'utils/request';


export default function v1(uri, queryParams) {
  return url(`/${uri}`, queryParams);
}
