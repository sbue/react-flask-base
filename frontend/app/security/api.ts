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

  static checkAuth() {
    return get(authUrl('/check-auth', {}), {})
  }

  // /**
  //  * @param {string} email
  //  */
  // static forgotPassword({ email }) {
  //   return post(authUrl('/reset'), { email })
  // }
  //
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

  // /**
  //  * @param {string} email
  //  */
  // static resendConfirmationEmail(email) {
  //   return post(authUrl('/resend-confirmation-email'), { email })
  // }
  //
  // /**
  //  * @param {string} token The reset token from the URL
  //  * @param {string} newPassword
  //  * @param {string} confirmNewPassword
  //  */
  // static resetPassword(token, { newPassword, confirmNewPassword }) {
  //   return post(authUrl(`/reset/${token}`), { newPassword, confirmNewPassword })
  // }

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
