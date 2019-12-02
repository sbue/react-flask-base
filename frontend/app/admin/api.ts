import { get, delete_, post, privateRequest } from 'utils/request';
import {adminUrl} from 'api';

export default class Admin {
  public static fetchUsers() {
    const f = () => get(adminUrl('/users', {}), {});
    return privateRequest(f);
  }

  public static deleteUser(userID) {
    const f = () => delete_(adminUrl(`/user/${userID}/delete`, {}), {});
    return privateRequest(f);
  }

  public static updateUser(userID, payload) {
    const f = () => post(adminUrl(`/user/${userID}/update`, {}), payload);
    return privateRequest(f);
  }
}
