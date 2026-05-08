import { LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import HeaderNavCSS from '../HeaderNav/HeaderNavCSS.css' with { type: 'css' };

export class HeaderNav extends LitElement {
  static styles = [ResetCSS, HeaderNavCSS];


  render() {
    return html`
      <header>
        <img src="./img/logo.png" alt="logoPYT" class="logo">
        <nav>
          <button @click=${() => this._navigate('./shop.html')}>Shop</button>
          <button @click=${() => this._navigate('./chooserecipe.html')}>New recipe</button>
          <button @click=${() => this._navigate('./cart.html')}>Cart</button>
          <button @click=${() => this._navigate('./user.html')}>User</button>
        </nav>
      </header>
    `;
  }

  _navigate(path) {
    window.location.href = path;
  }
}

customElements.define('header-nav', HeaderNav);