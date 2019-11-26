import {
  get,
  delete_,
  privateRequest,
} from 'utils/request';
import {adminUrl} from 'api';

export default class Admin {
  static fetchUsers() {
    const f = () => get(adminUrl('/users', {}), {});
    return privateRequest(f);
  }

  static deleteUserByID(userID) {
    const f = () => delete_(adminUrl(`/user/${userID}/delete`, {}), {});
    return privateRequest(f);
  }
}
