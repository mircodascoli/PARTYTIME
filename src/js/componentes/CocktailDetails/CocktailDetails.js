import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class CocktailDetails extends LitElement {
  static properties = {
    cocktail: { type: Object }
  };

  render() {
    return html`
      <li>
        <h2>${this.cocktail.name}</h2>
        <img src="${this.cocktail.image}" alt="${this.cocktail.name}" />
      </li>
    `;
  }
}

customElements.define('cocktail-details', CocktailDetails);
