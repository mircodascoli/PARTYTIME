import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import SignOutCSS from '../SignOut/SignOutCSS.css'with {type: 'css'};

export class SignOut extends LitElement {
  static styles = [ResetCSS, SignOutCSS];

  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();
  
  }
    _unsubscribe() {
     const modal = document.createElement('modal-log-out');
    document.body.appendChild(modal);
    modal.show();
  }

  render() {
    console.log('Welcoming updated, name:', this.name)
    return html`
        <button id="signOutButton" @click="${this._unsubscribe}">Unsubscribe</button>
    `;
  }
}

customElements.define('signout-component', SignOut);