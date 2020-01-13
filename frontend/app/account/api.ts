import _ from 'lodash';
import {FORM_DATA_FILE_KEY} from 'utils/constants';
import {delete_, get, post, privateRequest} from 'utils/request';
import {accountUrl} from 'api';

export default class Account {
  /**
   * @param {string} newEmail
   */
  static changeEmail({ newEmail }) {
    return privateRequest(() =>
      post(accountUrl('/settings/change-email', {}),
        { new_email: newEmail })
    );
  }

  /**
   * @param {string} oldPassword
   * @param {string} newPassword
   */
  static changePassword({ oldPassword, newPassword }) {
    return privateRequest(() =>
      post(accountUrl('/settings/change-password', {}),
        { old_password: oldPassword, new_password: newPassword })
    );
  }

  /**
   * @param {Object} payload The user details
   * @param {string} [payload.firstName]
   * @param {string} [payload.lastName]
   */
  public static changeUserInfo(payload) {
    const filteredData = _.pickBy({
      first_name: payload.firstName,
      last_name: payload.lastName,
    }, v => v !== null);
    return privateRequest(() =>
      post(accountUrl(`/settings/change-user-info`, {}), filteredData)
    );
  }

  public static deleteAccount() {
    return privateRequest(() =>
      delete_(accountUrl('/settings/delete-account', {}), {})
    );
  }


  public static checkAuth() {
    return privateRequest(() =>
      get(accountUrl('/check-auth', {}), {})
    );
  }

  /**
   * @param {string} email
   */
  public static forgotPassword({ email }) {
    return post(accountUrl('/reset-password', {}), { email });
  }

  /**
   * @param {string} token The reset token from the URL
   * @param {string} password
   */
  public static joinInviteSetPassword({ token, password }) {
    return post(accountUrl(`/sign-up/join-from-invite/${token}`, {}), { password });
  }

  /**
   * @param {string} email The username or email to authenticate
   * @param {string} password
   */
  public static login({ email, password }) {
    return post(accountUrl('/login', {}), { email, password });
  }

  public static logout() {
    return privateRequest(() =>
      delete_(accountUrl('/logout', {}), {})
    );
  }

  public static resendConfirmationEmail() {
    return privateRequest(() =>
      post(accountUrl('/resend-confirm-email', {}), {})
    );
  }

  /**
   * @param {string} token The reset token from the URL
   * @param {string} password
   */
  public static resetPassword({ token, password }) {
    return post(accountUrl(`/reset-password/${token}`, {}), { password });
  }

  /**
   * @param {string} token The confirm token from the URL
   */
  public static confirmEmail({ token }) {
    return privateRequest(() =>
      post(accountUrl(`/verify-email/${token}`, {}), {})
    );
  }

  /**
   * @param {Object} payload The user details
   * @param {string} payload.firstName
   * @param {string} payload.lastName
   * @param {string} payload.username
   * @param {string} payload.email
   * @param {string} payload.password
   */
  public static signUp(payload) {
    return post(accountUrl('/sign-up', {}), {
      email: payload.email,
      first_name: payload.firstName,
      last_name: payload.lastName,
      password: payload.password,
    });
  }

  /**
   * @param {File} file, see https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  public static uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append(FORM_DATA_FILE_KEY, file);
    return privateRequest(() =>
      post(accountUrl('/settings/profile-photo', {}), formData)
    );
  }

  public static deleteProfilePhoto() {
    return privateRequest(() =>
      delete_(accountUrl('/settings/profile-photo', {}), {})
    );
  }
}
