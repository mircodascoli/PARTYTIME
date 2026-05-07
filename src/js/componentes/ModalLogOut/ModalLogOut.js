import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import ModalLogOutCSS from '../ModalLogOut/ModalLogOutCSS.css' with { type: 'css' };
import { supabase } from '../../../config/supabaseClient.js';
export class ModalLogOut extends LitElement {
  static styles = [ResetCSS, ModalLogOutCSS];

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
        <p id="toastmessage">Do you want to log out?</p>
        <div class="button-container"></div>
          <button id="confirmButton" @click="${() => this._ConfirmLogOut()}">Confirm</button>
          <button id="cancelButton" @click="${() => this._CancelLogOut()}">Cancel</button>
      </div>
    `;
  }
   async _ConfirmLogOut() {
    await supabase.auth.signOut();
    sessionStorage.removeItem('user');
    window.location.href = '../index.html'; 
  }

  _CancelLogOut() {
    this.visible = false;
  }



}

customElements.define('modal-log-out', ModalLogOut);