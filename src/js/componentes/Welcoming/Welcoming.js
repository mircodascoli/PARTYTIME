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
        <div class="welcome-container"></div>
          <p id="welcome">Welcome, ${this.name}</p>
        </div>
    `;
  }
}

customElements.define('welcoming-component', Welcoming);