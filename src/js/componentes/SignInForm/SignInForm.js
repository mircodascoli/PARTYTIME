import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData, getInputValue, API_PORT } from '../../utils.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import SignInFormLitCSS from './SignInFormCSS.css' with { type: 'css' };

export class SignInForm extends LitElement {
  static styles = [ResetCSS, SignInFormLitCSS];

  static properties = {
    resultMessage: { type: String },
  };

  constructor() {
    super();
    this.resultMessage = '';
  }

  render() {
    return html`
      <form id="formLog" @submit="${this._onFormSubmit}">
        <p id="infoMessage">Register your account</p>
        <input type="text" id="nameSign" placeholder="Name" required>
        <input type="email" id="emailSign" placeholder="Email" required>
        <input type="password" id="passwordSign" placeholder="Password" required>
        <button type="submit" class="btn">Sign Up</button>
      </form>

      ${this.resultMessage
        ? html`<access-attempt-result .message="${this.resultMessage}"></access-attempt-result>`
        : ''
      }

      <a href="./login.html" class="login-or-sign">Or login</a>
    `;
  }

  async _onFormSubmit(e) {
    e.preventDefault();

    const name = this.renderRoot.getElementById('nameSign');
    const email = this.renderRoot.getElementById('emailSign');
    const password = this.renderRoot.getElementById('passwordSign');

    const signInData = {
      name: getInputValue(name),
      email: getInputValue(email),
      password: getInputValue(password),
    };

    if (signInData.email !== '' && signInData.password !== '') {
      const payload = JSON.stringify(signInData);
      const apiData = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/create/users`,
        'POST',
        payload
      );
      console.log('API response:', apiData);

      if (apiData?.acknowledged === true) {
        this.resultMessage = 'Account created successfully!';
      } else {
        this.resultMessage = 'User already exists';
      }
    } else {
      console.error('Not sending form data');
      this.resultMessage = 'Please fill in all fields';
    }
  }
}

customElements.define('signin-form', SignInForm);