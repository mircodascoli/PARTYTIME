import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import SelectQuantityCSS from '../SelectQuantity/SelectQuantityCSS.css' with { type: 'css' };

export class SelectQuantity extends LitElement {
  static styles = [ResetCSS, SelectQuantityCSS];
  static properties = {
    recipe: { type: Object },
    cocktail: { type: Object },
    quantity: { type: Number },
  };

  constructor() {
    super();
    this.recipe = null;
    this.cocktail = null;
    this.quantity = 5;
  }

  handleRange(e) {
    this.quantity = parseInt(e.target.value);
  }

  _goTo(next) {
    this.dispatchEvent(
      new CustomEvent('switch-view', {
        detail: { next, quantity: this.quantity },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="select-quantity-container">
        <div class="select-quantity-body">
          <h2 class="select-quantity-title">Select Quantity</h2>

          <div class="instructions-container">
            <p class="instructions">
              Move the slider to increase or decrease your batch quantity
            </p>
          </div>

          <div class="input-calculator">
            <label for="range" id="labelRange">Quantity:</label>
            <input
              id="range"
              type="range"
              min="1"
              max="10"
              step="1"
              .value="${String(this.quantity)}"
              @input="${this.handleRange}"
            />
            <p>
              <span class="people-units">for: ${this.quantity}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-users"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
              </svg>
            </p>
          </div>
        </div>
        <div class="select-quantity-button-container">
          <button class="back-recipe-button" @click="${() => this._goTo('A')}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 14l-4 -4l4 -4" />
              <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
            </svg>
            <span>Back</span>
          </button>
          <button class="next-recipe-button" @click="${() => this._goTo('C')}">
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M13 18l6 -6" />
              <path d="M13 6l6 6" />
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('select-quantity', SelectQuantity);
