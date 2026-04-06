import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import TotalCartCSS from '../TotalCart/TotalCartCSS.css' with { type: 'css' };

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
      <div class="total-cart">
        <h2>Total:</h2>
        <p>${this.total} €</p>
      </div>
    `;
  }
}

customElements.define('total-cart', TotalCart);