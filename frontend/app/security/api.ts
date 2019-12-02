import {
  delete_,
  get,
  post,
  privateRequest,
} from 'utils/request';
import {authUrl} from 'api';

export default class Auth {
  // /**
  //  * @param {string} password
  //  * @param {string} newPassword
  //  * @param {string} confirmNewPassword
  //  */
  // static changePassword({ password, newPassword, confirmNewPassword }) {
  //   return post(authUrl('/change-password'), { password, newPassword, confirmNewPassword })
  // }
  //

  public static checkAuth() {
    const f = () => get(authUrl('/check-auth', {}), {});
    return privateRequest(f);
  }

  /**
   * @param {string} email
   */
  public static forgotPassword({ email }) {
    return post(authUrl('/reset-password', {}), { email });
  }

  /**
   * @param {string} email The username or email to authenticate
   * @param {string} password
   */
  public static login({ email, password }) {
    return post(authUrl('/login', {}), { email, password });
  }

  public static logout() {
    const f = () => delete_(authUrl('/logout', {}), {});
    return privateRequest(f);
  }

  public static resendConfirmationEmail() {
    const f = () => post(authUrl('/resend-confirm-email', {}), {});
    return privateRequest(f);
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
    const f = () => post(authUrl(`/verify-email/${token}`, {}), {});
    return privateRequest(f);
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
    return post(authUrl('/sign-up', {}), payload);
  }

  // /**
  //  * @param {object} user The user whose profile is being updated
  //  * @param {object} payload Any modified fields to be updated
  //  */
  // static updateProfile(user, payload) {
  //   return patch(authUrl(`/users/${user.id}`), payload)
  // }
}
