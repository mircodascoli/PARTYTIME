import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import ModalLogOutCSS from '../ModalLogOut/ModalLogOuCSS.css' with { type: 'css' };

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
          <button id="confirmButton" @click="${() => this.visible = false}">Confirm</button>
          <button id="cancelButton" @click="${() => this.visible = false}">Cancel</button>
      </div>
    `;
  }
}

customElements.define('modal-log-out', ModalLogOut);