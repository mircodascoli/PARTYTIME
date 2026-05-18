import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import TotalCartCSS from '../TotalCart/TotalCartCSS.css' with { type: 'css' };
import { formatPrice } from '../../utils.js';

export class TotalCart extends LitElement {
  static styles = [ResetCSS, TotalCartCSS];

  static properties = {
    total: { type: Number },
  };

  constructor() {
    super();
    this.total = 0;
  }

  render() {
    console.log('TotalCart updated, total:', this.total)
    return html`

      <h2 class="order-summary">Order Summary</h2>
     <div class="items-total">
      <p>Items Total</p> <p>${formatPrice(this.total)}</p>
     </div> 
     <div class="delivery">
      <p class="delivery-title">Shipping:</p> <p class="delivery-free">Free</p>
     </div>
      <div class="total-cart">
      <h2>Total:</h2> <p>${formatPrice(this.total)}</p>
      </div>
      <button class="checkout-button">Checkout</button>
      <p class="disclaimer">This app is for practical purposes only. No real orders will be processed.</p>
    `;
  }
}

customElements.define('total-cart', TotalCart);