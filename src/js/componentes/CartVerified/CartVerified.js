import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CartVerifiedCSS from '../CartVerified/CartVerifiedCSS.css' with { type: 'css' };

export class CartVerified extends LitElement {
  static styles = [ResetCSS, CartVerifiedCSS];

  static properties = {
    visible: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.visible = false;
  }

  show() {
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, 1500);

  }

  render() {
    return html`
      <div class="toast-container ${this.visible ? 'visible' : ''}">
        <p id="toastmessage">✓ Added to the cart</p>
      </div>
    `;
  }
}

customElements.define('cart-verified', CartVerified);