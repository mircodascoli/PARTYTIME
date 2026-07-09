import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import WelcomingCSS from '../Welcoming/WelcomingCSS.css'with {type: 'css'};

export class Welcoming extends LitElement {
  static styles = [ResetCSS, WelcomingCSS];

  static properties = {
    name: { type: String },
  };

  constructor() {
    super();
    this.name = '';
  }

connectedCallback() {
  super.connectedCallback();

  const stored = sessionStorage.getItem('user');

  if (stored) {
    this.name = JSON.parse(stored).name;
  } else {
    window.addEventListener('user-ready', (e) => {
      this.name = e.detail.name;
    }, { once: true }); 
  }
}

  render() {
    console.log('Welcoming updated, name:', this.name)
    return html`
        <div class="welcome-container">
          <div class="hello-container">
            <h1 id="welcome-text">Welcome, ${this.name}</h1>
            <p>Here you can find your favorite recipes</p>
            <logout-component></logout-component>
          </div>
          <div class="button-new-recipe-container">
               <button class="add-button" @click=${this.addRecipe}> Add New Recipe</button>
            </div>
        </div>
    `;
  }
  addRecipe() {
  window.location.href = '/chooserecipe.html'; 
}
}

customElements.define('welcoming-component', Welcoming);