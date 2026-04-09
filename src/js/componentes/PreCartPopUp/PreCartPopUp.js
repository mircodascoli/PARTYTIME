import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import PreCartPopUpCSS from '../PreCartPopUp/PreCartPopUpCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import { getAPIData, API_PORT, SSID } from '../../utils.js';
export class PreCartPopUp extends LitElement {
 static styles = [ResetCSS, PreCartPopUpCSS];
 static properties = { product: { type: Object }, dbitem: { type: Object },   quantity: { type: Number } };

  constructor() {
    super();
    this.product = null;
    this.dbitem = null;
    this.quantity = 1;

  }
   connectedCallback() {
    super.connectedCallback();
    this.getProduct();
  }

  async getProduct() {
   try {
  console.log(this.product, 'sendin this to endpoint');
         let data = await getAPIData(
           `${location.protocol}//${location.hostname}${API_PORT}/api/product/preview/${this.product}`,
           'GET'
         );
   
         this.dbitem = data;
   
         console.log(this.dbitem, 'item found in db for preview');
       } catch (error) {
         console.error('Error fetching product:', error);
       }
  }

  render() {
    if (!this.dbitem) {
      return html`
        <div class="description-pop-up open">
          <h2>Loading...</h2>
        </div>
      `;
    }
   return html`
  
          <div class="popup-window">
            <div class="popup-header"><h2>${this.dbitem.name}</h2>
            <button class="popup-close-button" @click="${() => this.remove()}">X</button>
            </div>
            <div class="popup-body">
              <p class="popup-description">dummy suggestions of serving until db is ready$ {this.dbitem.description}</p>
              <img src="../../img/imgProductos/${this.dbitem.name}.png" alt="${this.dbitem.name}" class="preview-image" />
            <p class="popup-description">${this.dbitem.price}</p>
              <select id="quantity" @change=${this._handleQuantityChange}>
      ${Array.from({ length: 10 }, (_, i) => i + 1).map(num => html`
        <option value=${num}>${num}</option>
      `)}
    </select>
            <button class="popup-select-button" @click="${this.handleAddToCart}">Add to Cart</button>
            </div>
          </div>

    `;
  }
  _handleQuantityChange(event) {
    this.quantity = parseInt(event.target.value);
  } 
  async handleAddToCart() {
    
    this.user = SSID;

  let body = {
    productAndQuantity: {
      _id: this.dbitem._id,
      quantity: this.quantity
    },
    user: this.user
  };

  console.log(body, 'body');
  const PAYLOAD = JSON.stringify(body);
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/push/to/cart`, 'POST', PAYLOAD);
  return apiData;
}
}
customElements.define('pre-cart-popup', PreCartPopUp);