import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import TotalCartCSS from '../TotalCart/TotalCartCSS.css' with { type: 'css' };


export class TotalCart extends LitElement {
  static styles = [ResetCSS, TotalCartCSS];
  static properties = {
    apiData: { type: Object }
  };
 constructor() {
    super();
    this.apiData = null;

    try {
      this._idSession = JSON.parse(sessionStorage.getItem('user'))._id;
    } catch {
      console.warn('No user logged');
      this._idSession = null;
    }
  }
  connectedCallback() {
    super.connectedCallback();
  }

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