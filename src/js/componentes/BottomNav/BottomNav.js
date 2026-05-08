import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import BottomNavCSS from '../BottomNav/BottomNavCSS.css' with { type: 'css' };
export class BottomNav extends LitElement {
  static styles = [ResetCSS, BottomNavCSS];

  render() {
    return html`
      <nav>
        <button @click=${() => this._navigate('./shop.html')}>
          <span class="icon">🛍️</span>
          Shop
        </button>
        <button @click=${() => this._navigate('./chooserecipe.html')}>
          <span class="icon">🍽️</span>
          Recipe
        </button>
        <button @click=${() => this._navigate('./cart.html')}>
          <span class="icon">🛒</span>
          Cart
        </button>
        <button @click=${() => this._navigate('./user.html')}>
          <span class="icon">👤</span>
          User
        </button>
      </nav>
    `;
  }

  _navigate(path) {
    window.location.href = path;
  }
}

customElements.define('bottom-nav', BottomNav);