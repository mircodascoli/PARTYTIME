import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CocktailInfoCSS from '../CocktailInfo/CocktailInfoCSS.css'with {type: 'css'};

export class CocktailInfo extends LitElement {
  static styles = [ResetCSS, CocktailInfoCSS];

  static properties = {
  
  };

  constructor() {
    super();

  }

connectedCallback() {
  super.connectedCallback();

}

  render() {
    
    return html`
    <div class="popup-header">
        <h2>${this.cocktail.name}</h2>
      </div>
      <div class="popup-body">
          <p class="popup-description">${this.cocktail.description}</p>
          <img src="../../img/imgCocktails/${this.cocktail.name}.jpeg" alt="${this.cocktail.name}" class="img-popup-cocktails" />
          <button class="popup-select-button" @click="${() => this.SelectRecipeToCalc(this.cocktail) }" @click="${() => this.remove() }">SELECT</button> 
        </div>
       
    `;
  }
}

customElements.define('cocktail-info', CocktailInfo);