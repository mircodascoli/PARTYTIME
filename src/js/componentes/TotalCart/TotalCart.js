import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import TotalCartCSS from '../TotalCart/TotalCartCSS.css' with { type: 'css' };
import { formatPrice } from '../../utils.js';
import { getSSNAME, getSSEMAIL } from '../../utils.js';

export class TotalCart extends LitElement {
  static styles = [ResetCSS, TotalCartCSS];

  static properties = {
    total: { type: Number },
    products: { type: Array },
    status: { type: String },
    statusMessage: { type: String },
  };

  constructor() {
    super();
    this.total = 0;
    this.products = [];
    this.status = 'idle';
    this.statusMessage = '';
  }

  _handleOrderCompleted(e) {
    console.log('Ordine completato:', e.detail);
    this.status = 'success'; // ✅ fisso, non da e.detail
    this.statusMessage = e.detail.message || 'Order completed successfully';
  }

  _handleOrderFailed(e) {
    console.error('Ordine fallito:', e.detail);
    this.status = 'error'; // ✅ fisso, non da e.detail
    this.statusMessage = e.detail.message || 'Order failed. Please try again.';
  }
  render() {
    console.log('TotalCart updated, total:', this.total);
    console.log('mailer output:', this.status); // perche undefined se
    return html`
      <h2 class="order-summary">Order Summary</h2>
      <div class="items-total">
        <p>Items Total</p>
        <p>${formatPrice(this.total)}</p>
      </div>
      <div class="delivery">
        <p class="delivery-title">Shipping:</p>
        <p class="delivery-free">Free</p>
      </div>
      <div class="total-cart">
        <h2>Total:</h2>
        <p>${formatPrice(this.total)}</p>
      </div>
      <checkout-button
        class="checkout-button"
        .total=${this.total}
        .name=${getSSNAME()}
        .email=${getSSEMAIL()}
        .products=${this.products}
        @order-completed=${this._handleOrderCompleted}
        @order-failed=${this._handleOrderFailed}
        >Checkout</checkout-button
      >
      ${
        this.status === 'success'
          ? html`<p class="message success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-mail-fast"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 7h3" />
                <path d="M3 11h2" />
                <path
                  d="M9.02 8.801l-.6 6a2 2 0 0 0 1.99 2.199h7.98a2 2 0 0 0 1.99 -1.801l.6 -6a2 2 0 0 0 -1.99 -2.199h-7.98a2 2 0 0 0 -1.99 1.801"
                />
                <path
                  d="M9.8 7.5l2.982 3.28a3 3 0 0 0 4.238 .202l3.28 -2.982"
                />
              </svg>
              <span>Order confirmed! Check your email.</span>
            </p>`
          : ''
      }
      ${
        this.status === 'error'
          ? html`<p class="message error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-message-exclamation"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 9h8" />
                <path d="M8 13h6" />
                <path
                  d="M15 18h-2l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5"
                />
                <path d="M19 16v3" />
                <path d="M19 22v.01" />
              </svg>
              <span>${this.statusMessage}</span>
            </p>`
          : ''
      }
      <p class="disclaimer">
        This app is for practical purposes only. No real orders will be
        processed.
      </p>
    `;
  }
}

customElements.define('total-cart', TotalCart);
