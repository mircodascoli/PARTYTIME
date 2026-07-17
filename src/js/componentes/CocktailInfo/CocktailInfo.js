import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CocktailInfoCSS from '../CocktailInfo/CocktailInfoCSS.css'with {type: 'css'};

export class CocktailInfo extends LitElement {
  static styles = [ResetCSS, CocktailInfoCSS];

  static properties = {
  cocktail: { type: Object }
  };

  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();

}

  render() {
    
    return html`
    <div class="cocktail-info-data-container">
      <div class="cocktail-info-pic-container"> 
       <img src="../../img/imgCocktails/${this.cocktail.name}.png" alt="${this.cocktail.name}" class="img-popup-cocktails" />
      </div>
      <div class="cocktail-info-title-description-container">
        <h2 class="cocktail-info-title">${this.cocktail.name}</h2>
        <p class="popup-description">${this.cocktail.description}</p>
      </div>  
      <div class="cocktail-info-button-container">
        <button class="popup-select-button" @click="${() => this.SelectRecipeToCalc(this.cocktail) }">
          <span>NEXT</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>  
        </button>
      </div>
    </div>  
    `;
  }
  SelectRecipeToCalc(recipeSelected) {
  this.dispatchEvent(new CustomEvent('switch-view', {
    detail: {
      next: 'B',
      recipeSelected: recipeSelected,
    },
    bubbles: true,
    composed: true,
  }));
}
}

customElements.define('cocktail-info', CocktailInfo);