import _ from 'lodash';
import { get, delete_, post, privateRequest } from 'utils/request';
import {adminUrl} from 'api';

export default class Admin {
  public static fetchUsers() {
    return privateRequest(() =>
      get(adminUrl('/users', {}), {})
    );
  }

  /**
   * @param {string} userID The identifier of the user being deleted
   */
  public static deleteUser(userID) {
    return privateRequest(() =>
      delete_(adminUrl(`/user/${userID}/delete`, {}), {})
    );
  }

  /**
   * @param {string} userID The identifier of the user being updated
   * @param {Object} payload The user details
   * @param {string} [payload.firstName]
   * @param {string} [payload.lastName]
   * @param {string} [payload.email]
   * @param {string} [payload.role]
   * @param {boolean} [payload.verifiedEmail]
   */
  public static updateUser(userID, payload) {
    const filteredData = _.pickBy({
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      role: payload.role,
      verified_email: payload.verifiedEmail,
    }, v => v !== null);
    return privateRequest(() =>
      post(adminUrl(`/user/${userID}/update`, {}), filteredData)
    );
  }

  /**
   * @param {Object} payload The user details
   * @param {string} [payload.firstName]
   * @param {string} [payload.lastName]
   * @param {string} [payload.email]
   * @param {string} [payload.role]
   */
  public static inviteUser(payload) {
    return privateRequest(() =>
      post(adminUrl(`/invite-user`, {}), {
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        role: payload.role,
      })
    );
  }
}
