import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData, getInputValue, API_PORT } from '../../utils.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import SignInFormLitCSS from './SignInFormCSS.css' with { type: 'css' };
import { supabase } from '../../../config/supabaseClient.js';

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
        <button type="button" class="btn btn-google" @click="${this._onGoogleSignIn}">
          Sign Up with Google
        </button>
      </form>

      ${this.resultMessage
        ? html`<access-attempt-result .message="${this.resultMessage}"></access-attempt-result>`
        : ''
      }

      <a href="./login.html" class="login-or-sign">Or login</a>
    `;
  }

  async _onGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/user.html'
      }
    });

    if (error) {
      this.resultMessage = error.message;
    }
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

    // 1. Registra su Supabase
    const { error } = await supabase.auth.signUp({
      email: signInData.email,
      password: signInData.password,
    });

    if (error) {
      this.resultMessage = error.message;
      return;
    }

    // 2. Registra su MongoDB
    const payload = JSON.stringify(signInData);
    const apiData = await getAPIData(
      `${location.protocol}//${location.hostname}${API_PORT}/api/create/users`,
      'POST',
      payload
    );

    if (apiData?.acknowledged === true) {
      this.resultMessage = 'Account created successfully!';
    } else {
      this.resultMessage = 'User already exists';
    }

  } else {
    this.resultMessage = 'Please fill in all fields';
  }
}
}

customElements.define('signin-form', SignInForm);