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
    console.log('Loading the data');
    if (!this._idSession) return;

    const payload = JSON.stringify({ id: this._idSession });

    try {
      const apiData = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/buscar/usuario`,
        'POST',
        payload
      );

      

      this.apiData = apiData;
console.log(this.apiData.cart, 'apidata.cart from cartlist');
    } catch (err) {
      console.error("Error loading recipes:", err);
    }
  }

 render() {
     if (!this.apiData) return html`<p>Loading...</p>`;
  return html`


  <ul class="cart-list">

        ${this.apiData.cart?.length === 0
          ? html`<p>No items in cart.</p>`
          : this.apiData.cart.map(item => html`

            <div class="recipe-card">

              <button class="delete-item">X</button>

              <div class="recipe-data">
                <h2>${item._id}</h2>
                <h3>${item.quantity}</h3>
                <p class="serving-description">dummy suggestions of serving until db is ready$ {this.item.serving}</p>

              </div>

            </div>

          `)
        }

        </ul>
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

