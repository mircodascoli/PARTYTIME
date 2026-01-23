import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import DescriptionPopUpCSS from '../DescriptionPopUp/DescriptionPopUpCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
export class DescriptionPopUp extends LitElement {
 static styles = [ResetCSS, DescriptionPopUpCSS];
 static properties = { cocktail: { type: Object }};
  constructor() {
    super();
    this.cocktail = null;
  }

  render() {
    if (!this.cocktail) {
      return html`
        <div class="description-pop-up open">
          <h2>Loading...</h2>
        </div>
      `;
    }
   return html`
  
          <div class="popup-window">
            <div class="popup-header"><h2>${this.cocktail.name}</h2>
            <button class="popup-close-button" @click="${() => this.remove()}">X</button>
            </div>
            <div class="popup-body">
            <p class="popup-description">${this.cocktail.description}</p>
            <button class="popup-select-button">SELECT</button>
            </div>
          </div>

    `;
  }
}

customElements.define('description-pop-up', DescriptionPopUp);