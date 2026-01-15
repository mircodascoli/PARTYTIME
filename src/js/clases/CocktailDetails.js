import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
export class CocktailDetails extends LitElement {
  static properties = {
    cocktail: { type: Object }
  };

  render() {
    if (!this.cocktail) return html``;

    const { name, image } = this.cocktail;

    return html`
      <li>
        <h3>${name}</h3>
        <p>${image}</p>

        </ul>
      </li>
    `;
  }
}

customElements.define('cocktail-details', CocktailDetails);