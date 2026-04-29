import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import SignOutCSS from '../SignOut/SignOutCSS.css'with {type: 'css'};
import { getAPIData,API_PORT, getSSID } from '../../utils.js';
export class SignOut extends LitElement {
  static styles = [ResetCSS, SignOutCSS];

  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();
  
  }
    _unsubscribe() {
    if (confirm('¿Estás seguro de borrar tu usuario?')) {
      let payload = JSON.stringify({ _id: getSSID })
      let apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/user/`, 'DELETE', payload);
      console.log(apiData)
       sessionStorage.removeItem('user')  
      alert('Usuario borrado correctamente') 
       location.href = './index.html' 
    }
  }

  render() {
    console.log('Welcoming updated, name:', this.name)
    return html`
        <button id="signOutButton" @click="${this._unsubscribe}">Unsubscribe</button>
    `;
  }
}

customElements.define('signout-component', SignOut);