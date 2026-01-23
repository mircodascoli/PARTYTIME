import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import CocktailDetailsCSS from '../CocktailDetails/CocktailDetailsCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
export class CocktailDetails extends LitElement {
    static styles = [ResetCSS, CocktailDetailsCSS];
  static properties = {
    cocktail: { type: Object }
  };

  render() {
    return html`
      <li class="cocktail-item">
        <h2>${this.cocktail.name}</h2>
        <img src="../../img/imgCocktails/${this.cocktail.name}.jpeg" alt="${this.cocktail.name}" class="img-list-cocktails" />
      </li>
    `;
  }
}

customElements.define('cocktail-details', CocktailDetails);
