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
      <form id="formSign" @submit="${this._onFormSubmit}">
        <slot></slot>
        <p id="infoMessage">Get Back to your account</p>
        <input type="email" id="emailLog" placeholder="Your email" required>
        <input type="password" id="passwordLog" placeholder="Your password" required>
        <button type="submit" class="btn">Login</button>
          <button type="button" class="btn btn-google" @click="${this._onGoogleLogin}">
          Login with Google
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