import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import ShopCSS from './ShopCSS.css' with { type: 'css' };
import { getAPIData, API_PORT } from '../../main.js'; 
import { launchpreCartPoPup } from '../utils.js';
import '../SearchBar/SearchBar.js'; // registra <search-bar>
 
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
 
  // Riceve i risultati dal figlio <search-bar> e aggiorna la lista
  _onResults(e) {
    this.bottles = e.detail.results;
  }
  _onReset() {
  this.getBottles(); // ricarica tutta la lista originale
}
 
  render() {
    return html`
      <search-bar @search-results=${this._onResults} @search-reset=${this._onReset}></search-bar>
 
      <ul class="products-list">
        ${this.bottles.map(bottle => html`
          <li class="product-item">
            <img src="../../img/imgProductos/${bottle.name}.png" alt="${bottle.name}" class="product-image" />
            <h2>${bottle.name}</h2>
            <p>${bottle.price} €</p>
            <p>${bottle.description}</p>
            <button
              class="add-to-cart-button"
              @click=${() => launchpreCartPoPup(bottle.name)}
            >Add to Cart</button>
          </li>
        `)}
      </ul>
    `;
  }
}
 
customElements.define('shop-component', Shop);