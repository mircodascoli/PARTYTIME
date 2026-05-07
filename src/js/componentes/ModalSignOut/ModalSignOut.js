import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import { getAPIData,API_PORT, getSSID } from '../../utils.js';
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
      <div class="toast-container ${this.visible ? 'visible' : ''}">
        <p id="toastmessage">Do you want to sign out?</p>
        <div class="button-container"></div>
          <button id="confirmButton" @click="${() => this._ConfirmSignOut()}">Confirm</button>
          <button id="cancelButton" @click="${() => this._CancelSignOut()}">Cancel</button>
      </div>
    `;
  }
   async _ConfirmSignOut() {
    await supabase.auth.signOut();
    sessionStorage.removeItem('user');
    let payload = JSON.stringify({ _id: getSSID })
    let apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/user/`, 'DELETE', payload);
    console.log(apiData)
    sessionStorage.removeItem('user')  
    window.location.href = '../index.html'; 
  }

  _CancelSignOut() {
    this.visible = false;
  }



}

customElements.define('modal-sign-out', ModalSignOut);