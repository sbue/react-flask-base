import _ from 'lodash';
import {delete_, get, post, privateRequest} from 'utils/request';
import {authUrl} from 'api';

export default class Auth {
  /**
   * @param {string} newEmail
   */
  static changeEmail({ newEmail }) {
    return privateRequest(() =>
      post(authUrl('/settings/change-email', {}),
        { new_email: newEmail })
    );
  }

  /**
   * @param {string} oldPassword
   * @param {string} newPassword
   */
  static changePassword({ oldPassword, newPassword }) {
    return privateRequest(() =>
      post(authUrl('/settings/change-password', {}),
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
      post(authUrl(`/settings/change-user-info`, {}), filteredData)
    );
  }

  public static deleteAccount() {
    return privateRequest(() =>
      delete_(authUrl('/settings/delete-account', {}), {})
    );
  }


  public static checkAuth() {
    return privateRequest(() =>
      get(authUrl('/check-auth', {}), {})
    );
  }

  /**
   * @param {string} email
   */
  public static forgotPassword({ email }) {
    return post(authUrl('/reset-password', {}), { email });
  }

  /**
   * @param {string} token The reset token from the URL
   * @param {string} password
   */
  public static joinInviteSetPassword({ token, password }) {
    return post(authUrl(`/sign-up/join-from-invite/${token}`, {}), { password });
  }

  /**
   * @param {string} email The username or email to authenticate
   * @param {string} password
   */
  public static login({ email, password }) {
    return post(authUrl('/login', {}), { email, password });
  }

  public static logout() {
    return privateRequest(() =>
      delete_(authUrl('/logout', {}), {})
    );
  }

  public static resendConfirmationEmail() {
    return privateRequest(() =>
      post(authUrl('/resend-confirm-email', {}), {})
    );
  }

  /**
   * @param {string} token The reset token from the URL
   * @param {string} password
   */
  public static resetPassword({ token, password }) {
    return post(authUrl(`/reset-password/${token}`, {}), { password });
  }

  /**
   * @param {string} token The confirm token from the URL
   */
  public static confirmEmail({ token }) {
    return privateRequest(() =>
      post(authUrl(`/verify-email/${token}`, {}), {})
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
    return post(authUrl('/sign-up', {}), {
      email: payload.email,
      first_name: payload.firstName,
      last_name: payload.lastName,
      password: payload.password,
    });
  }
}
