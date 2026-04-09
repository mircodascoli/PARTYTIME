import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import MyRecipesCSS from '../MyRecipes/MyRecipesCSS.css' with { type: 'css' };
import { getAPIData, API_PORT, SSID } from '../../utils.js';
import {  launchpreCartPoPup } from '../../utils.js';
export class MyRecipes extends LitElement {

  static styles = [ResetCSS, MyRecipesCSS];

  static properties = {
    apiData: { type: Object }
  };

  constructor() {
    super();
    this.apiData = null;

    try {
      this._idSession = SSID;
    } catch {
      console.warn('No user logged');
      this._idSession = null;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadApiData();
  }

  async loadApiData() {
    console.log('Loading the data');
    if (!this._idSession) return;

    const payload = JSON.stringify({ id: this._idSession });

    try {
      const apiData = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/buscar/usuario`,
        'POST',
        payload
      );

      this.apiData = apiData;
    } catch (err) {
      console.error("Error loading recipes:", err);
    }
  }

  async buySetClick(ingredientes) {
    console.log('buy set function activated by the click', ingredientes);
  }

  async clearList() {
    if (!this._idSession) return;
    console.log('clear recipe event lauched');

    const payload = JSON.stringify({ userId: this._idSession });
    console.log(payload)
    try {
      await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/clear/recipes`,
        'DELETE',
        payload
      );

      this.apiData = {
        ...this.apiData,
        recipes: []
      };

    } catch (err) {
      console.error("Error clearing recipes:", err);
    }
  }

  async deleteRecipe(recipeId) {
    if (!this._idSession) return;

    const payload = JSON.stringify({
      userId: this._idSession,
      recipeId
    });
    console.log('delete recipe payload', payload);
     try {
      await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/delete/recipe`,
        'DELETE',
        payload
      );

      // aggiornamento UI senza reload
      this.apiData = {
        ...this.apiData,
        recipes: this.apiData.recipes.filter(r => r._id !== recipeId)
      };

    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  } 


  render() {
  const recipes = this.apiData?.recipes ?? [];

  return html`

    ${recipes.length >= 1
      ? html`
        <button class="clear-button" @click=${this.clearList}>
          Clear List
        </button>
      `
      : null
    }

    ${recipes.length <= 2
      ? html`
        <button class="add-button" @click=${this.addRecipe}>
          Add New Recipe
        </button>
      `
      : null
    }

    <div class="my-recipes-container">
      <ul class="recipes-list">

        ${recipes.length === 0
          ? html`<p>No recipes saved.</p>`
          : recipes.map(item => html`

            <li class="recipe-card">

              <button
                class="delete-recipe"
                @click=${() => this.deleteRecipe(item._id)}>
                X
              </button>

              <div class="recipe-title">
                <p>${item.name} × ${item.amount}</p>
              </div>

              <div class="recipe-data">

                <!-- INGREDIENTS -->
                <ul class="recipe-ingredients-list">
                  ${item.ingredientes.map(ing => html`
                    <li class="recipe-ingredient">
                      ${ing.name} ${ing.mls}ml
                    </li>
                  `)}
                </ul>

                <!-- SERVING -->
                <p class="serving-description">
                  ${item.serving ?? "Serving suggestion coming soon"}
                </p>

                <!-- PRODUCTS -->
                <ul class="recipe-products-list">
                  ${item.ingredientes.map(ing => html`
                    <li class="product-item">

                      <p>${ing.dbname}</p>

                      <img
                        src="../../img/imgProductos/${ing.dbname}.png"
                        alt="${ing.dbname}"
                        class="suggested-product-image"
                        @click=${() => launchpreCartPoPup(ing.dbname)}
                        @error=${(e) => e.target.src = '../../img/fallback.png'}
                      />

                      <button
                        class="buy-button"
                        @click=${() => launchpreCartPoPup(ing.dbname)}>
                        BUY
                      </button>

                    </li>
                  `)}
                </ul>

              </div>

            </li>

          `)
        }

      </ul>
    </div>
  `;
}
}

customElements.define('my-recipes', MyRecipes);
