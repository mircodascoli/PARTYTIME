import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import DescriptionPopUpCSS from '../DescriptionPopUp/DescriptionPopUpCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
export class DescriptionPopUp extends LitElement {
    static styles = [ResetCSS, DescriptionPopUpCSS];
  static properties = {
    cocktail: { type: Object }
  };

  render() {
    return html`
      <div class="description-popup">
        <h2>${this.cocktail.name}</h2>
        <img src="../../img/imgCocktails/${this.cocktail.name}.jpeg" alt="${this.cocktail.name}" class="img-list-cocktails" />
        <p>${this.cocktail.description}</p>
      </div>
    `;
  }
}

customElements.define('description-pop-up', DescriptionPopUp);