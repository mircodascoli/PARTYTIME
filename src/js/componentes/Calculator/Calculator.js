import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import CalculatorCSS from '../Calculator/CalculatorCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };

export class Calculator extends LitElement {

 static properties = { recipe: { type: Object } };
 static styles = [ResetCSS, CalculatorCSS];
  connectedCallback() {
    super.connectedCallback();

    const storedRecipe = sessionStorage.getItem('selectedCraft');

    if (storedRecipe) {
      this.recipe = JSON.parse(storedRecipe);
      console.log('Ricetta caricata nel calculator:', this.recipe);
    }
  }

  render() {
    if (!this.recipe) {
      return html`
      <div class="no-recipe-selected">
        <p>No recipe selected please select one first</p>
      <button @click="${() => history.back()}">Go Back</button>
      </div>
      `;
    }

    return html`
      <h2>${this.recipe.name}</h2>
      <p>${this.recipe.ingredients[0].name}</p>
      <p>${this.recipe.ingredients[1].name}</p>
      <p>${this.recipe.ingredients[2].name}</p>
      <p>${this.recipe.ingredients[3].name}</p>

      <!-- calcolatrice qui -->
    `;
  }
}


customElements.define('calculator-component', Calculator);