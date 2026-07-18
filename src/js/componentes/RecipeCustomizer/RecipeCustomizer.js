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
        <div class="underlay">
          <div class="description-pop-up open">
            <h2>Loading...</h2>
          </div>
        </div>
      `;
    }
    return html`
      <div class="underlay" @click="${this._onUnderlayClick}">
        <div
          class="popup-window"
          @click="${(e) => e.stopPropagation()}"
          @switch-view="${this._onSwitchView}"
          @close-popup="${() => this.remove()}"
        >
          <div class="popup-close-button-container">
            <button class="close-btn" aria-label="Close" @click="${() => this.remove()}">
             <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M18 6L6 18M6 6l12 12"/>
             </svg>
           </button>
       
          </div>
          <div class="popup-child-container">
             ${this.activeView === 'A'
              ? html`<cocktail-info .cocktail="${this.cocktail}"></cocktail-info>`
              : html`<calculator-component .recipe="${this.selectedRecipe}"></calculator-component>`}
          </div>
        </div>
      </div>
    `;
  }

  _onUnderlayClick() {
    this.remove();
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