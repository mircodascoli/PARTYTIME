import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import ThreeDotMenuCSS from '../ThreeDotMenu/ThreeDotMenuCSS.css'with {type: 'css'};
import { getAPIData, API_PORT } from '../../utils.js';
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
              <button @click=${this.deleteRecipe}>Delete recipe</button>
            </div>
          `
        : ''
      }
    `;
  }

    async deleteRecipe(recipeId) {
    if (!this._idSession) return;

    const payload = JSON.stringify({
      userId: this._idSession,
      recipeId: this._id
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
}

customElements.define('three-dot-menu', ThreeDotMenu);