import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import LogInFormCSS from '../LoginForm/LoginFormCSS.css' with { type: 'css' };
import { getAPIData, API_PORT } from '../../utils.js';

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
        <input type="email" id="emailLog" placeholder="Your email" minlength="3" required>
        <input type="password" id="passwordLog" placeholder="Your password" minlength="3" required>
        <button type="submit" class="btn" title="Login">Login</button>
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
      const payload = JSON.stringify({ email, password });
      const apiData = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/login`,
        'POST',
        payload
      );

      if (apiData) {
        sessionStorage.setItem('user', JSON.stringify(apiData));
        this.resultMessage = 'Login successful, redirecting...';
        setTimeout(() => {
          location.href = './user.html';
        }, 1000);
      } else {
        this.resultMessage = 'Invalid email or password';
      }

    } catch (error) {
      console.error('Error in login request:', error);
      this.resultMessage = 'Error: Invalid email or password';
    }
  }
}

customElements.define('log-in-form', LoginForm);