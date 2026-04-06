import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import ProductsListCSS from '../ProductsList/ProductsListCSS.css' with { type: 'css' };
/* import { getAPIData, API_PORT } from '../../main.js'; */

export class ProductsList extends LitElement {
  static styles = [ResetCSS, ProductsListCSS];

  static properties = {
    bottles: { type: Array }
  };

  constructor() {
    super();
    this.bottles = [];
  }

  connectedCallback() {
    super.connectedCallback();
   /*  this.getBottles(); */
  }

 /*  async getBottles() {
    try {
     let data = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/read/cocktails`,
        'GET'
      );

      this.cocktails = data;

      console.log(this.cocktails, 'cocktails mapped to model'); 
    } catch ( error ) {
   console.error('Error fetching cocktails:', error); 
    }
  } */

 render() {
  return html`
<p>Productos</p>
  `; 
 }

}
customElements.define('products-list', ProductsList);
