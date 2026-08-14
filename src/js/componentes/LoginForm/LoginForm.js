import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import LogInFormCSS from '../LoginForm/LoginFormCSS.css' with { type: 'css' };
import { supabase } from '../../../config/supabaseClient.js';

export class LoginForm extends LitElement {
  static styles = [ResetCSS, LogInFormCSS];

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
    <slot></slot>
    <p class="info-message">Get Back to your account</p>
    <input type="email" class="email-log" placeholder="Your email" required>
    <input type="password" class="password-log" placeholder="Your password" required>
    <button type="submit" class="btn btn-submit">Login</button>
    <button type="button" class="btn btn-google" @click="${this._onGoogleLogin}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" aria-hidden="true" viewBox="0 0 25 24" data-testid="kc-button-icon" tx="variants" class="sc-38d59e4e-0 lekvEE"><path fill="#2D6A8F" fill-rule="evenodd" d="M16.8 6.907c-1.166-1.115-2.649-1.683-4.3-1.683-2.93 0-5.41 1.98-6.295 4.638A6.8 6.8 0 0 0 5.852 12c0 .742.128 1.463.353 2.137.885 2.66 3.365 4.639 6.295 4.639 1.514 0 2.802-.4 3.81-1.074a5.18 5.18 0 0 0 2.245-3.396H12.5V9.955h10.596c.132.736.204 1.503.204 2.3 0 3.427-1.227 6.31-3.355 8.27-1.861 1.718-4.408 2.725-7.445 2.725A11.245 11.245 0 0 1 1.25 12 11.246 11.246 0 0 1 12.5.75c3.032 0 5.579 1.115 7.527 2.93z" clip-rule="evenodd"></path></svg>
      <span class="btn-google-text">Continue with Google</span>
    </button>
    <a href="./sign.html" class="login-or-sign">Or Sign Up</a>
</form>

      ${this.resultMessage
        ? html`<access-attempt-result .message="${this.resultMessage}"></access-attempt-result>`
        : ''
      }
    `;
  }

  async _onFormSubmit(e) {
    e.preventDefault();

    const email = this.renderRoot.querySelector('#emailLog').value;
    const password = this.renderRoot.querySelector('#passwordLog').value;

    if (!email || !password) {
      this.resultMessage = 'Email or password missing';
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        this.resultMessage = error.message;
        return;
      }

      this.resultMessage = 'Login successful, redirecting...';

      setTimeout(() => {
        location.href = '/user.html';
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      this.resultMessage = 'Something went wrong';
    }
  }
    async _onGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
         redirectTo: window.location.origin + '/user.html',
      queryParams: {
        prompt: 'select_account' 
      }
      }
    });

    if (error) {
      this.resultMessage = error.message;
    }
  }
}

customElements.define('log-in-form', LoginForm);