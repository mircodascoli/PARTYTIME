import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import PreCartPopUpCSS from '../PreCartPopUp/PreCartPopUpCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
export class PreCartPopUp extends LitElement {
 static styles = [ResetCSS, PreCartPopUpCSS];
 static properties = { product: { type: Object }};
  constructor() {
    super();
    this.product = null;
  }

  render() {
    if (!this.product) {
      return html`
        <div class="description-pop-up open">
          <h2>Loading...</h2>
        </div>
      `;
    }
   return html`
  
          <div class="popup-window">
            <div class="popup-header"><h2>${this.product.name}</h2>
            <button class="popup-close-button" @click="${() => this.remove()}">X</button>
            </div>
            <div class="popup-body">
            <p class="popup-description">${this.product.price}</p>
            <button class="popup-select-button" @click="${() => this.SelectRecipeToCalc(this.product) }" @click="${() => this.remove() }">Add to Cart</button>
            </div>
          </div>

    `;
  }
   
}
customElements.define('pre-cart-popup', PreCartPopUp);