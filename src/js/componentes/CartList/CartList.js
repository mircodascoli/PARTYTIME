import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CartListCSS from '../CartList/CartListCSS.css' with { type: 'css' };
import { getAPIData, API_PORT, getSSID, formatPrice } from '../../utils.js';

export class CartList extends LitElement {
  static styles = [ResetCSS, CartListCSS];

  static properties = {
    apiData: { type: Object }
  };

  constructor() {
    super();
    this.apiData = null;

    try {
      this._idSession = getSSID();
    } catch {
      console.warn('No user logged');
      this._idSession = null;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadApiData();
  }

  async loadApiData() {
    if (!this._idSession) return;

    try {
      const apiData = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/buscar/usuario`,
        'POST',
        JSON.stringify({ id: this._idSession })
      );

      const enrichedCart = await Promise.all(
        apiData.cart.map(async (item) => {
          const details = await getAPIData(
            `${location.protocol}//${location.hostname}${API_PORT}/api/find/bottles/${item._id}`,
            'GET'
          );
          return { ...item, ...details };
        })
      );

      this.apiData = { ...apiData, cart: enrichedCart };

    } catch (err) {
      console.error("Error loading cart:", err);
    }
  }

  getTotal() {
    console.log('getTotal called, cart:', this.apiData?.cart);
    if (!this.apiData || !this.apiData.cart.length) return '0.00';
     const total = this.apiData.cart
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)
    .toFixed(2);
  console.log('total calculated:', total);
  return total;
  }

  render() {
    if (!this.apiData) return html`<p>Loading...</p>`;

    return html`
      <ul class="cart-list">
        ${this.apiData.cart.map(item => html`
          <li class="cart-item">
          <div class="cart-card">
            <button class="delete-item" @click=${() => this.deleteItem(item._id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></button>
            <img src="../../img/imgProductos/${item.name}.png" alt="${item.name}" class="cart-product-image" />
            <div class="cart-card-data">
              <h2 class="cart-product-name">${item.name}</h2>
              <p class="cart-product-description">${item.description}</p>
              <p class="cart-product-price">${formatPrice(item.price)}</p>
            </div>
          </div>
          <drop-down-cart-menu class="drop-down-menu" .quantity=${item.quantity} ._id=${item._id} @quantity-changed=${this.updateTotal}></drop-down-cart-menu>
          </li>
        `)}
      </ul>
      <total-cart .total=${this.getTotal()}></total-cart>
    `;
  }

  async deleteItem(id) {
    if (!this._idSession) return;

    try {
      await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/delete/item`,
        'DELETE',
        JSON.stringify({ userId: this._idSession, itemId: id })
      );

      this.apiData = {
        ...this.apiData,
        cart: this.apiData.cart.filter(r => r._id !== id)
      };

    } catch (err) {
      console.error("Error deleting item", err);
    }
  }

  updateTotal() {
    window.location.reload();
  }
}

customElements.define('cart-list', CartList);