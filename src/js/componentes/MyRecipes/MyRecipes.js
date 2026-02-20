import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import MyRecipesCSS  from '../MyRecipes/MyRecipesCSS.css' with { type: 'css' }
import { getAPIData, API_PORT } from '../../main.js'

export class MyRecipes extends LitElement {
    static styles = [
    ResetCSS, MyRecipesCSS
  ]
   static get properties() {
    return {
      apiData: { type: Object }
  
    };
  }

    constructor() {
    super();
    this.apiData = null;
    try {
      this._idSession = JSON.parse(sessionStorage.getItem('user'))._id;
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
    const payload = JSON.stringify({ id: this._idSession });
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/buscar/usuario`, 'POST', payload);
    console.log(apiData, "valore di apidata, alla fine della funzione e prima del  render");
    this.apiData = apiData;
    this.requestUpdate();
  }
  clearList(){
    console.log('clear recipe event lauched')
  let userId = this._idSession
  console.log(userId)
  const body = {
    userId
  }
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/clear/recipes`, 'DELETE', payload);
  console.log(apiData)
  alert('Recipe cleared!')
 location.reload();   
  }
  deleteRecipe(recipeName){ 
    console.log('delete recipe event lauched for', recipeName)
      let userId = this._idSession
  console.log(userId)
  const body = {
    userId, 
    recipeName
  }
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/recipe`, 'DELETE', payload);
  console.log(apiData)
  alert(recipeName,'Recipe deleted!')
  }
  
    render() {
      return html`
       <button class="clear-button" @click="${this.clearList}">Clear List</button>
      <div class="my-recipes-container">
       <ul class="recipes-list">
        ${this.apiData.recipes.map(item => html`
         
        <div class="recipe-card">
          <button class="delete-recipe" @click=${() => this.deleteRecipe(item.recipe.name)}>X</button>
          <div class="recipe-title">
            <p>${item.recipe.name} X${item.recipe.amount}</p>
          </div>
          <div class="recipe-data">
          
               <ul class="recipe-ingredients-list">
               ${item.recipe.ingredientes.map(ing => html`<li> ${ing.name} ${ing.mls}ml</li>`)}
            </ul>
            <ul class="recipe-products-list">
            ${item.recipe.ingredientes.map(ing => html`<li> ${ing.dbname}</li><button>BUY</button>`)}
            </ul>

            <button>BUY SET</button>

          </div>

        </div>
      `)}
    </ul>
      </div>
      `
    }
  }
customElements.define('my-recipes', MyRecipes);