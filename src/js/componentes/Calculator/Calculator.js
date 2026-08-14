import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CalculatorCSS from '../Calculator/CalculatorCSS.css' with { type: 'css' };
import { getAPIData, API_PORT, getSSID } from '../../utils.js';
export class Calculator extends LitElement {

 static properties = { 
  recipe: { type: Object },
  quantity: { type: Number },
};
 static styles = [ResetCSS, CalculatorCSS];
 
   constructor() {
    super();
    this.quantity = 5;
  }


  connectedCallback() {
    super.connectedCallback();

    const storedRecipe = sessionStorage.getItem('selectedCraft');

    
    if (storedRecipe) {
      this.recipe = JSON.parse(storedRecipe);
  
      sessionStorage.removeItem('selectedCraft');
    }
  }
  disconnectedCallback() {
  super.disconnectedCallback();
  sessionStorage.removeItem('selectedCraft');
}

    handleRange(e) {
    const target = e.target;
    this.quantity = parseInt(target.value);

    this.requestUpdate();
  }

  async handleSaveClick() {
    console.log('this.recipe', this.recipe.serving);
  const recipe = {
    name: this.recipe.name,
    amount: this.quantity,
    serving: this.recipe.serving,
    ingredientes: this.recipe.ingredients.map(i => ({
      name: i.name,
      mls: i.ml * this.quantity,
      dbname: i.dbname
    })),
    description: this.recipe.description
  };

  try {
   await this.guardarReceta(recipe);
   
    location.href = './user.html'

  } catch (err) {
    console.error('Error saving receta', err);
    alert('Something went wrong ');
  }
  
}

handleOthersClick() {
    this.dispatchEvent(new CustomEvent('close-popup', {
    bubbles: true,
    composed: true,
  }));
}
 async guardarReceta(recipe) {
  const idUserNum = getSSID();
  const body = {
    recipe,
    idUser: idUserNum
  };
  console.log(body, 'body in guardar receta');
  const PAYLOAD = JSON.stringify(body);
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/push/to/recipes`, 'POST', PAYLOAD);

  return apiData;
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
     
      <div class="container-calculator">
        <div class="recipe-name-container">
           <h2 class="calculator-recipe-name">${this.recipe.name} </h2>
        </div>

        <div class="instructions-container">
           <p class="instructions">Move the slider to increase or decrease your batch quantity</p>
        </div>
         
        <div class="input-calculator">
          <label for="range" id="label-range">Quantity:</label>
          <input id="range" type="range" min="1" max="10" step="1" value="5" @input=${this.handleRange}/>
          <p class="people-units"> for: ${this.quantity}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
        </div>

        <div id="resultados">
          <table class="tabla-calculos" cellspacing="1px" cellpadding="">
            <thead>
              <th>ingredients:</th> <th>quantity:</th>
            </thead>
            <tbody>
               ${this.recipe.ingredients.map(i => html`
                <tr>
                  <td>${i.name}</td> <td>${i.ml*this.quantity} ml</td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>  

         <div class="calculator-button-container">       
          <button class="another-recipe-button" @click="${this.handleOthersClick}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>  
            <span>Another recipe</span>
          </button>
           <button class="save-recipe-button" @click="${this.handleSaveClick}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M10 14h4" /><path d="M12 12v4" /></svg>
            <span>Save and party!</span>
          </button>
        </div>

      </div>
    `;
  }

}

customElements.define('calculator-component', Calculator);