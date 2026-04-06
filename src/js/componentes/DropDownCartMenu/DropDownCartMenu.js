import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import DropDownCartMenuCSS from '../DropDownCartMenu/DropDownCartMenuCSS.css' with { type: 'css' };
import { getAPIData, API_PORT } from '../../main.js';
export class DropDownCartMenu extends LitElement {
static styles = [ResetCSS, DropDownCartMenuCSS];
static properties = {
    quantity: { type: Number }, 
    _isOpen: { state: true },   
    _id: { type: String }
  };
constructor() {
    super();
    // Qui imposti il VALORE DI DEFAULT
    this._id= "";
    this.quantity = 1; 
    this._isOpen = false;
  }
render() {
    return html`
      <div class="select-box" @click="${this._toggleMenu}">
        <span>Qty: ${this.quantity}</span>
        <span>${this._isOpen ? '▲' : '▼'}</span>
      </div>

      ${this._isOpen ? html`
        <ul class="options-container">
          ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => html`
            <li class="option" @click="${() => this._select(num)}">
              ${num}
              ${num === this.quantity ? html`<span class="check">✓</span>` : ''}
            </li>
          `)}
        </ul>
      ` : ''}
    `;
  }

  _toggleMenu() {
    this._isOpen = !this._isOpen;
  }

  _select(val) {
    this.quantity = val;
    this._isOpen = false;
    this.handleQuantityChange(val);
  }
  async handleQuantityChange(val) {
 const idUserNum = JSON.parse(sessionStorage.getItem('user'))._id
     this.user = idUserNum
 
   let body = {
     productAndQuantity: {
       _id: this._id,
       quantity: val
     },
     user: this.user
   };

 
   const PAYLOAD = JSON.stringify(body);
   const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/cart/item/update`, 'PUT', PAYLOAD);
   return apiData;
  }

}
customElements.define('drop-down-cart-menu', DropDownCartMenu);