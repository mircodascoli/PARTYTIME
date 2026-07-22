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
  constructor() {
    super();
    this.quantity = 5;
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
        <div>
           <h2 class="calculator-recipe-name">${this.recipe.name} </h2>
        </div>
         
        <div class="input-calculator">
          <label for="range" id="label-range">Quantity:</label>
          <input id="range" type="range" min="1" max="10" step="1" value="5" @input=${this.handleRange}/>
          <p class="people-units"> for: ${this.quantity}[i]</p>
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
          <button class="save-recipe-button" @click="${this.handleSaveClick}">[i] Save and party!</button>
          <button class="another-recipe-button" @click="${this.handleOthersClick}">[i] Another recipe</button>
        </div>
        
      </div>
    `;
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

}

customElements.define('calculator-component', Calculator);