import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import RecipeCustomizerCSS from '../RecipeCustomizer/RecipeCustomizerCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };

export class RecipeCustomizer extends LitElement {
  static styles = [ResetCSS, RecipeCustomizerCSS];
  static properties = {
    cocktail: { type: Object },
    activeView: { type: String },
    selectedRecipe: { type: Object },
  };

  constructor() {
    super();
    this.cocktail = null;
    this.activeView = 'A';
    this.selectedRecipe = null;
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
       <div class="popup-window" 
         @switch-view="${this._onSwitchView}"
         @close-popup="${() => this.remove()}">
        <div class="popup-close-button-container">
          <button class="popup-close-button" @click="${() => this.remove()}">X</button>
        </div>
        ${this.activeView === 'A'
          ? html`<cocktail-info .cocktail="${this.cocktail}"></cocktail-info>`
          : html`<calculator-component .recipe="${this.selectedRecipe}"></calculator-component>`}
      </div>
    `;
  }

  _onSwitchView(e) {
    const { next, recipeSelected } = e.detail;
    this.activeView = next;
    if (recipeSelected) {
      this.selectedRecipe = recipeSelected;
    }
  }
}

customElements.define('recipe-customizer', RecipeCustomizer);