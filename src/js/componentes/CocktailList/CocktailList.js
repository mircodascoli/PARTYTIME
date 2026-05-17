import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CocktailListCSS from '../CocktailList/CocktailListCSS.css' with { type: 'css' };
import '../../componentes/CocktailDetails/CocktailDetails.js';
import { getAPIData, API_PORT } from '../../utils.js';

export class CocktailList extends LitElement {
  static styles = [ResetCSS, CocktailListCSS];

  static properties = {
    cocktails: { type: Array }
  };

  constructor() {
    super();
    this.cocktails = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.getCocktails();
  }

  async getCocktails() {
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
  }

 render() {
  return html`
    <ul class="cocktail-list">
      ${this.cocktails.map(
        cocktail => html`
          <cocktail-details  @click=${() => this._clickToChoose(cocktail)} .cocktail=${cocktail}></cocktail-details>
        `
      )}
    </ul>
  `;
 }
 _clickToChoose(recipeSelected) {
    this.dispatchEvent(new CustomEvent('item-selected', {
      detail: recipeSelected,
      bubbles: true,
      composed: true
    }));
 }
}
customElements.define('cocktail-list', CocktailList);

