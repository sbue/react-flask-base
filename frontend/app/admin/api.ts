import {
  delete_,
  get,
  post,
  privateRequest,
} from 'utils/request';
import {adminUrl} from 'api';

export default class Admin {
  static fetchUsers() {
    return get(adminUrl('/fetch-users', {}), {})
  }
}
