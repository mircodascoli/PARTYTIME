import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CartListCSS from '../CartList/CartListCSS.css' with { type: 'css' };
import { getAPIData, API_PORT, SSID } from '../../utils.js';

export class CartList extends LitElement {
  static styles = [ResetCSS, CartListCSS];

  static properties = {
    apiData: { type: Object }
  };

  constructor() {
    super();
    this.apiData = null;

    try {
      this._idSession = SSID;
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
          <div class="cart-card">
            <button class="delete-item" @click=${() => this.deleteItem(item._id)}>X</button>
            <div class="recipe-data">
              <img src="../../img/imgProductos/${item.name}.png" alt="${item.name}" class="cart-product-image" />
              <h2>${item.name}</h2>
              <p>${item.price} €</p>
              <p>${item.description}</p>
              <drop-down-cart-menu .quantity=${item.quantity} ._id=${item._id} @quantity-changed=${this.updateTotal}></drop-down-cart-menu>
            </div>
          </div>
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