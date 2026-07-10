import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import MyRecipesCSS from '../MyRecipes/MyRecipesCSS.css' with { type: 'css' };
import { getAPIData, API_PORT, getSSID } from '../../utils.js';
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
      this._idSession = getSSID();
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
    <div class="my-recipes-container">
      <ul class="recipes-list">
        ${recipes.length === 0
          ? html`<p>No recipes saved yet.</p>`
          : html`
              <p class="your-recipes-p">Your recipes:</p>
              ${recipes.map(item => html`
                <li class="recipe-card">
                  <div class="delete-recipe-container">
                    <button class="delete-recipe" @click=${() => this.deleteRecipe(item._id)}>x</button>
                  </div>

                  <div class="recipe-header">
                    <img src="../../../img/imgCocktails/${item.name}.png" alt="${item.name}" class="recipe-preview-image" />
                    <div class="name-desciption-container">
                      <p><span class="span-recipe-title">${item.name} </span> × ${item.amount}</p>
                      <p class="recipe-preview-description">${item.description}</p>
                    </div>
                  </div>

                  <div class="recipe-data">
                    <div class="recipe-ingredients-container">
                      <ul class="recipe-ingredients-list">
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-data"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 17v-4" /><path d="M12 17v-1" /><path d="M15 17v-2" /><path d="M12 17v-1" /></svg> <span class="span-grey">ingredients:</span></p>
                        ${item.ingredientes.map(ing => html`
                          <li class="recipe-ingredient"><span> &#x2022;</span> ${ing.name} ${ing.mls} ml</li>
                        `)}
                      </ul>
                      <hr class="section-divider" />
                    </div>

                    

                    <div class="serving-container">
                      <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-milkshake"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 10a5 5 0 0 0 -10 0" /><path d="M6 11a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1l0 -1" /><path d="M7 13l1.81 7.243a1 1 0 0 0 .97 .757h4.44a1 1 0 0 0 .97 -.757l1.81 -7.243" /><path d="M12 5v-2" /></svg><span class="span-grey"> Serving suggestion:</span></p>
                      <p class="serving-description">${item.serving}</p>
                       <hr class="section-divider" />
                    </div>

                   

                    <div class="recipe-ingredients-container">
                      <ul class="recipe-products-list">
                        ${item.ingredientes.map(ing => html`
                          <li class="product-item">
                            <img src="../../img/imgProductos/${ing.dbname}.png" alt="${ing.dbname}" class="suggested-product-image" @click=${() => launchpreCartPoPup(ing.dbname)} @error=${(e) => e.target.src = '../../img/fallback.png'} />
                            <p class= "p-ingredient-name">${ing.dbname}</p>
                            <button class="btn-black" @click=${() => launchpreCartPoPup(ing.dbname)}>BUY</button>
                          </li>
                        `)}
                      </ul>
                    </div>
                  </div>
                </li>
              `)}
            `
        }
      </ul>
    </div>
  `;
}


}


customElements.define('my-recipes', MyRecipes);
