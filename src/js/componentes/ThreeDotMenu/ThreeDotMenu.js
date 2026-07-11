import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import ThreeDotMenuCSS from '../ThreeDotMenu/ThreeDotMenuCSS.css'with {type: 'css'};
export class ThreeDotMenu extends LitElement {
  static properties = {
    open: { type: Boolean, state: true }
  };

   static styles = [ResetCSS, ThreeDotMenuCSS];

  constructor() {
    super();
    this.open = false;
    this._onClickOutside = this._onClickOutside.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onClickOutside);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onClickOutside);
    super.disconnectedCallback();
  }

  _onClickOutside(e) {
    if (!this.open) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.open = false;
    }
  }

  _toggleMenu(e) {
    e.stopPropagation();
    this.open = !this.open;
  }



  render() {
    return html`
      <button class="menu-trigger" @click=${this._toggleMenu}>⋮</button>

      ${this.open
        ? html`
            <div class="dropdown">
              <button @click=${this.deleteRecipeClick}>Delete recipe</button>
            </div>
          `
        : ''
      }
    `;
  }

   deleteRecipeClick() {
      this.dispatchEvent(new CustomEvent('delete-recipe', {
      detail: { recipeId: this.recipeId },
      bubbles: true,
      composed: true
    }));
    this.open = false;
  }
 
}

customElements.define('three-dot-menu', ThreeDotMenu);