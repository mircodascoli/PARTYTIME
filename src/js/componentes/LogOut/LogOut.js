import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import LogOutCSS from '../LogOut/LogOutCSS.css' with { type: 'css' };


export class LogOut extends LitElement {
  static styles = [ResetCSS, LogOutCSS];

  async _LogOut() {
    const modal = document.createElement('modal-log-out');
    document.body.appendChild(modal);
    modal.show();
  }

  render() {
    return html`
      <button id="signOutButton" @click="${this._LogOut}">Log Out</button>
    `;
  }
}

customElements.define('logout-component', LogOut);