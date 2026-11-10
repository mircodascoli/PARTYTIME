import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import SelectQuantityCSS from '../SelectQuantity/SelectQuantityCSS.css' with { type: 'css' };
export class SelectQuantity extends LitElement {
  static styles = [ResetCSS, SelectQuantityCSS];
  static properties = {
    recipe: { type: Object },
    cocktail: { type: Object },
  };

    constructor() {
      super();
      this.recipe = null;
      this.cocktail = null;
    }

  _goTo(next) {
    this.dispatchEvent(
      new CustomEvent('switch-view', {
        detail: { next },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="select-quantity-container">
        <h2 class="select-quantity-title">Select Quantity</h2>
        <button @click="${() => this._goTo('A')}">Back</button>
        <button @click="${() => this._goTo('C')}">Next</button>
      </div>
    `;
  }
}

customElements.define('select-quantity', SelectQuantity);