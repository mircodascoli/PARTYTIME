import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import LogOutCSS from '../LogOut/LogOutCSS.css' with { type: 'css' };
import { supabase } from '../../../config/supabaseClient.js';

export class LogOut extends LitElement {
  static styles = [ResetCSS, LogOutCSS];

  async _LogOut() {
    await supabase.auth.signOut();
    sessionStorage.removeItem('user');
    window.location.href = '../index.html';
  }

  render() {
    return html`
      <button id="signOutButton" @click="${this._LogOut}">Log Out</button>
    `;
  }
}

customElements.define('logout-component', LogOut);