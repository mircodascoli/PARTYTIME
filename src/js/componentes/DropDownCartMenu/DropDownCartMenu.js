import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import DropDownCartMenuCSS from '../DropDownCartMenu/DropDownCartMenuCSS.css' with { type: 'css' };
import { getAPIData, API_PORT, getSSID } from '../../utils.js';

export class DropDownCartMenu extends LitElement {
  static styles = [ResetCSS, DropDownCartMenuCSS];
  static properties = {
    quantity: { type: Number },
    _isOpen: { state: true },
    _dropDirection: { state: true },
    _id: { type: String }
  };

  constructor() {
    super();
    this._id = "";
    this.quantity = 1;
    this._isOpen = false;
    this._dropDirection = 'drop-down';
    this._onDocumentClick = this._onDocumentClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onDocumentClick);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="select-box" @click="${this._toggleMenu}">
        <span class="qty-span">Qty:</span>
        <span class="selected">${this.quantity}</span>
        <span class="arrow">${this._isOpen ? '▲' : '▼'}</span>
      </div>

      ${this._isOpen ? html`
        <ul class="options-container ${this._dropDirection}">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => html`
            <li class="option" @click="${() => this._select(num)}">
              ${num}
              ${num === this.quantity ? html`<span class="check">✓</span>` : ''}
            </li>
          `)}
        </ul>
      ` : ''}
    `;
  }

  _toggleMenu(e) {
    e.stopPropagation();
    if (!this._isOpen) {
      this._calculateDropDirection();
    }
    this._isOpen = !this._isOpen;
  }

  _calculateDropDirection() {
    const box = this.shadowRoot.querySelector('.select-box');
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const estimatedMenuHeight = 9 * 32 + 12; // ~ opzioni + padding, stima grezza

    this._dropDirection = spaceBelow < estimatedMenuHeight ? 'drop-up' : 'drop-down';
  }

  _onDocumentClick(e) {
    if (this._isOpen && !e.composedPath().includes(this)) {
      this._isOpen = false;
    }
  }

  _select(val) {
    this.quantity = val;
    this._isOpen = false;
    this.handleQuantityChange(val);
    this.dispatchEvent(new CustomEvent('quantity-changed', {
      detail: { quantity: val },
      bubbles: true,
      composed: true
    }));
  }

  async handleQuantityChange(val) {
    this.user = getSSID();
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