import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import ShopCSS from './ShopCSS.css' with { type: 'css' };
import { getAPIData, API_PORT, launchpreCartPoPup, formatPrice } from '../../utils.js'; 

import '../SearchBar/SearchBar.js'; 
 
export class Shop extends LitElement {
  static styles = [ResetCSS, ShopCSS];
 
  static properties = {
    bottles: { type: Array }
  };
 
  constructor() {
    super();
    this.bottles = [];
  }
 
  connectedCallback() {
    super.connectedCallback();
    this.getBottles();
  }
 
  async getBottles() {
    try {
      let data = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/read/botellas`,
        'GET'
      );
      this.bottles = data;
      console.log(this.bottles, 'bottles mapped to model');
    } catch (error) {
      console.error('Error fetching bottles:', error);
    }
  }
 
 
  _onResults(e) {
    this.bottles = e.detail.results;
  }
  _onReset() {
  this.getBottles(); 
}
 
  render() {
    return html`
      <search-bar @search-results=${this._onResults} @search-reset=${this._onReset} class="search-bar"></search-bar>
 
      <ul class="products-list">
        ${this.bottles.map(bottle => html`
          <li class="product-item">
            <img src="../../img/imgProductos/${bottle.name}.png" alt="${bottle.name}" class="product-image" />
            <h2 class="product-name">${bottle.name}</h2>
            <p class="product-price">${formatPrice(bottle.price)}</p>
            <button class="add-to-cart-button" @click=${() => launchpreCartPoPup(bottle.name)}>
           <span class="add-to-cart-span">Add to cart</span> 
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12.5 17h-6.5v-14h-2" /><path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
            </button>
          </li>
        `)} 
      </ul>
    `;
  }
}
 
customElements.define('shop-component', Shop);