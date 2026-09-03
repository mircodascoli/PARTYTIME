import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
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
      <form class="form-sign" @submit="${this._onFormSubmit}">
        <p class="info-message">Register your account</p>
        <input type="text" class="name-sign" placeholder="Name" required />
        <input type="email" class="email-sign" placeholder="Email" required />
        <input
          type="password"
          class="password-sign"
          placeholder="Password"
          required
        />
        <button type="submit" class="btn btn-submit">Sign Up</button>
        <button
          type="button"
          class="btn btn-google"
          @click="${this._onGoogleSignIn}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            aria-hidden="true"
            viewBox="0 0 25 24"
            data-testid="kc-button-icon"
            tx="variants"
            class="sc-38d59e4e-0 lekvEE"
          >
            <path
              fill="#2D6A8F"
              fill-rule="evenodd"
              d="M16.8 6.907c-1.166-1.115-2.649-1.683-4.3-1.683-2.93 0-5.41 1.98-6.295 4.638A6.8 6.8 0 0 0 5.852 12c0 .742.128 1.463.353 2.137.885 2.66 3.365 4.639 6.295 4.639 1.514 0 2.802-.4 3.81-1.074a5.18 5.18 0 0 0 2.245-3.396H12.5V9.955h10.596c.132.736.204 1.503.204 2.3 0 3.427-1.227 6.31-3.355 8.27-1.861 1.718-4.408 2.725-7.445 2.725A11.245 11.245 0 0 1 1.25 12 11.246 11.246 0 0 1 12.5.75c3.032 0 5.579 1.115 7.527 2.93z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span>Continue with Google </span>
        </button>
        <a href="./login.html" class="login-or-sign">Or login</a>
      </form>

      ${
        this.resultMessage
          ? html`<access-attempt-result
              .message="${this.resultMessage}"
            ></access-attempt-result>`
          : ''
      }
    `;
  }

  async _onGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/user.html',
      },
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
