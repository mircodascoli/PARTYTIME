import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import CalculatorCSS from '../Calculator/CalculatorCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import { getAPIData, API_PORT } from '../../main.js';
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
     
      <div class="container-calculador">
        <div id="inputscalculador">
          <label for="seleccionador">${this.recipe.name} </label>
          <label for="range" id="label-range">Quantity:</label>
          <input id="range" type="range" min="1" max="10" step="1" value="5" @input=${this.handleRange}/>
          <span id="people-units"> for: ${this.quantity} <svg fill="#0000" class="people" width="64px" height="64px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z"></path> </g></svg></span>
        </div>

        <div id="resultados">
          <table id="tabla-calculos" cellspacing="1px" cellpadding="">
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
          ${this.selected
            ? html`<p class="total-ml"> Total: <strong>${this.totalMl} ml </strong></p>`
            : null}
          <button id="save" @click="${this.handleClick}">Save and party!</button>
          <button  @click="${() => history.back()}">Another one</button>
        </div>
      </div>
    `;
  }
  handleRange(e) {
    const target = e.target;
    this.quantity = parseInt(target.value);

    this.requestUpdate();
  }

  async handleClick() {
  const recipe = {
    name: this.recipe.name,
    amount: this.quantity,
    ingredientes: this.recipe.ingredients.map(i => ({
      name: i.name,
      mls: i.ml * this.quantity,
      dbname: i.dbname
    }))
  };

  try {
    const result = await this.guardarReceta(recipe);

    this.dispatchEvent(new CustomEvent('receta-guardada', {
      detail: result,
      bubbles: true,
      composed: true
    }));

  } catch (err) {
    console.error('Error saving receta', err);
    alert('Something went wrong 😬');
  }
}

 async guardarReceta(recipe) {
  const idUserNum = JSON.parse(sessionStorage.getItem('user'))._id
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