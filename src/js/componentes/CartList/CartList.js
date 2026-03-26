import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CartListCSS from '../CartList/CartListCSS.css' with { type: 'css' };
/* import { getAPIData, API_PORT } from '../../main.js'; */

export class CartList extends LitElement {
  static styles = [ResetCSS, CartListCSS];

  static properties = {
/*     cocktails: { type: Array } */
  };

  constructor() {
    super();
/*     this.cocktails = []; */
  }

  connectedCallback() {
    super.connectedCallback();
    this.getCart();
    console.log('CartList connected to the DOM');
  }

  /* async getCart() {
    try {
      let data = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/read/cocktails`,
        'GET'
      );

      this.cocktails = data;

      console.log(this.cocktails, 'cocktails mapped to model');
    } catch (error) {
      console.error('Error fetching cocktails:', error);
    }
  } */

 render() {
  return html`
  
    <p>Cart List</p>
  `;
 }
/*  _clickToChoose(recipeSelected) {
    
    console.log(`Cocktail selezionato: ${recipeSelected.name} ${recipeSelected.description}`);

    this.dispatchEvent(new CustomEvent('item-selected', {
      detail: recipeSelected,
      bubbles: true,
      composed: true
    }));
 } */
}
customElements.define('cart-list', CartList);

