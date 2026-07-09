import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import { getAPIData, API_PORT, getSSID } from '../../utils.js';
import ModalSignOutCSS from '../ModalSignOut/ModalSignOutCSS.css' with { type: 'css' };
import { supabase } from '../../../config/supabaseClient.js';

export class ModalSignOut extends LitElement {
  static styles = [ResetCSS, ModalSignOutCSS];

  static properties = {
    visible: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  render() {
    return html`
      <div class="underlay ${this.visible ? 'visible' : ''}" @click="${this._onUnderlayClick}">
        <div class="toast-container" @click="${(e) => e.stopPropagation()}">
          <p id="toastmessage">Do you want to sign out?</p>
          <div class="button-container">
            <button id="confirmButton" @click="${() => this._ConfirmSignOut()}">Confirm</button>
            <button id="cancelButton" @click="${() => this._CancelSignOut()}">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  _onUnderlayClick() {
    this._CancelSignOut();
  }

  async _ConfirmSignOut() {
    await supabase.auth.signOut();

    const payload = JSON.stringify({ _id: getSSID() }); // era getSSID senza chiamata, mancava il () -> id sbagliato

    try {
      const apiData = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/delete/user/`,
        'DELETE',
        payload
      );
      console.log(apiData);
    } catch (error) {
      console.error('Error deleting user:', error);
      // valuta se vuoi comunque reindirizzare o mostrare un errore all'utente qui
    }

    sessionStorage.removeItem('user');
    window.location.href = '../index.html';
  }

  _CancelSignOut() {
    this.visible = false;
  }
}

customElements.define('modal-sign-out', ModalSignOut);