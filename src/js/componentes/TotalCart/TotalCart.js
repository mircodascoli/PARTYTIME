import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import TotalCartCSS from '../TotalCart/TotalCartCSS.css' with { type: 'css' };


export class TotalCart extends LitElement {
  static styles = [ResetCSS, TotalCartCSS];
  static properties = {
    data : { type: Array},
  };
 constructor() {
    super();
     this.data = [];
  }
 connectedCallback() {
    super.connectedCallback();
    this.getTotalCart();
     console.table('total cart connected', this.data)
  }
    getTotalCart() {
  };
 


 render() {
  
  return html`
    <div class="total-cart"></div>
      <h2>Total:</h2>
        <p>total price when is ready</p>
    </div>      
  `;
 }
}
customElements.define('total-cart', TotalCart);