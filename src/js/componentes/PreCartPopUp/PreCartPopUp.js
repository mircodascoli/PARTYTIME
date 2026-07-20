import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import PreCartPopUpCSS from '../PreCartPopUp/PreCartPopUpCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import { getAPIData, API_PORT, getSSID } from '../../utils.js';
import { ConfirmAddedToCart } from '../../utils.js';
import { formatPrice } from '../../utils.js';
export class PreCartPopUp extends LitElement {
  static styles = [ResetCSS, PreCartPopUpCSS];
  static properties = { product: { type: Object }, dbitem: { type: Object }, quantity: { type: Number } };

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
        <div class="underlay">
          <div class="description-pop-up open">
            <h2>Loading...</h2>
          </div>
        </div>
      `;
    }
    return html`
      <div class="underlay" @click="${this._onUnderlayClick}">
        <div class="popup-window" @click="${(e) => e.stopPropagation()}">
          <div class="popup-close-button-container">
             <button class="close-btn" aria-label="Close" @click="${() => this.remove()}">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
             </button>
          </div>

          <div class="precart-body-container">

            <div class="precart-pic-container">
              <img src="../../img/imgProductos/${this.dbitem.name}.png" alt="${this.dbitem.name}" class="precart-image" />
            </div>

            <h2 class="precart-info-title" >${this.dbitem.name}</h2>
            <p class="popup-description">${this.dbitem.description}</p>
            <p class="popup-price">${formatPrice(this.dbitem.price)}</p> 
            
            <div class="precart-inputs-container">
              <select id="quantity" @change=${this._handleQuantityChange}>
              ${Array.from({ length: 10 }, (_, i) => i + 1).map(num => html` <option value=${num}>${num}</option>`)}
              </select>
              <div class="precart-button-container">
                <button class="popup-select-button" @click="${this.handleAddToCart}">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12.5 17h-6.5v-14h-2" /><path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                <span>Add to Cart</span>
                </button>
             </div>

           </div>
            
          </div>

        </div>
        
      </div>
    `;
  }

  _onUnderlayClick(e) {
    this.remove();
  }

  _handleQuantityChange(event) {
    this.quantity = parseInt(event.target.value);
  }

  async handleAddToCart() {
    this.user = getSSID();

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

    ConfirmAddedToCart();
    this.remove();
    return apiData;
  }
}
customElements.define('pre-cart-popup', PreCartPopUp);