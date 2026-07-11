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
      <button class="log-out-button" @click="${this._LogOut}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-power"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 6a7.75 7.75 0 1 0 10 0" /><path d="M12 4l0 8" /></svg></button>
    `;
  }
}

customElements.define('logout-component', LogOut);