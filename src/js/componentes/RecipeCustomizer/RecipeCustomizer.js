import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import RecipeCustomizerCSS from '../RecipeCustomizer/RecipeCustomizerCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
export class RecipeCustomizer extends LitElement {
 static styles = [ResetCSS, RecipeCustomizerCSS];
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
      <div class="popup-close-button container">
        <button class="popup-close-button" @click="${() => this.remove()}">X</button>
      </div>
     <cocktail-info .cocktail="${this.cocktail}"></cocktail-info>
     </div>

    `;
  }
   SelectRecipeToCalc(recipeSelected) {
    try {
  sessionStorage.setItem('selectedCraft', JSON.stringify(recipeSelected))
  }catch (err) {
    console.error('Error setting cocktail to session storage', err);
    alert('Something went wrong when selecting the cocktail');
  }
    finally {
    location.href = './calculator.html'
    }
}
}
customElements.define('recipe-customizer', RecipeCustomizer);