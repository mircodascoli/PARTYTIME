// @ts-no-check

export class User {
  /**
   * @param {string} email
   * @param {string} [password='']
   * @param {string} name
   * @param {'user' | 'admin'} [rol='user']
   * @param {string} [token='']
   */
  constructor(email, password = '', rol='user', token ='',) {

    this.email = email
    this.password = password
    this.token= token
    this.rol= rol
    
  }
}
