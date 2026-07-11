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
            <div class="user-log-container">
             <div id="welcome-text"><span class="welcome-text"><span class="welcome-span">Welcome,</span> <span class="user-name-span">${this.name}</span></div>
             <logout-component></logout-component>
            </div>
            <p>Here you can find your favorite recipes</p> 
          </div>

          <div class="button-new-recipe-container">
              <button class="add-button" @click=${this.addRecipe}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg> Add New Recipe</button>
            </div>
        </div>
    `;
  }
  addRecipe() {
  window.location.href = '/chooserecipe.html'; 
}
}

customElements.define('welcoming-component', Welcoming);