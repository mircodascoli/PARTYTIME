import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CartListCSS from '../CartList/CartListCSS.css' with { type: 'css' };
 import { getAPIData, API_PORT } from '../../main.js'; 

export class CartList extends LitElement {
  static styles = [ResetCSS, CartListCSS];

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
     this.loadApiData();
  }

 async loadApiData() {
  if (!this._idSession) return;

  try {
    const apiData = await getAPIData(
      `${location.protocol}//${location.hostname}${API_PORT}/api/buscar/usuario`,
      'POST',
      JSON.stringify({ id: this._idSession })
    );

    const enrichedCart = await Promise.all(
      apiData.cart.map(async (item) => {
        const details = await getAPIData(
          `${location.protocol}//${location.hostname}${API_PORT}/api/find/bottles/${item._id}`,
          'GET'
        );
        return { ...item, ...details }; // { _id, quantity, name, price, ... }
      })
    );

    this.apiData = { ...apiData, cart: enrichedCart };
    console.log('Enriched cart data:', this.apiData);

  } catch (err) {
    console.error("Error loading cart:", err);
  }
}

 render() {
     if (!this.apiData) return html`<p>Loading...</p>`;
  return html`


  <ul class="cart-list">

        ${this.apiData.cart.map(item => html`
  <div class="cart-card">
    <button class="delete-item">X</button>
    <div class="recipe-data">
      <img src="../../img/imgProductos/${item.name}.png" alt="${item.name}" class="cart-product-image" />
      <h2>${item.name}</h2>
      <p>${item.price} €</p>
      <p>description when is ready${item.description}</p>
     
         <drop-down-cart-menu .quantity=${item.quantity}></drop-down-cart-menu> 
    </div>
  </div>
`)}

        </ul>
  `;
 }

}
customElements.define('cart-list', CartList);

