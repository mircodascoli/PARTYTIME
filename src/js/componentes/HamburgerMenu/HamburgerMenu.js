import { LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import HamburgerMenuCSS from '../HamburgerMenu/HamburgerMenuCSS.css' with { type: 'css' };
export class HamburgerMenu extends LitElement {
  static properties = {
    open: { type: Boolean },
    links: { type: Array },
  };

  static styles = [ResetCSS, HamburgerMenuCSS];
   constructor() {
    super();
    this.open = false;
      this.links = [];
  }
 
  _toggle() {
    this.open = !this.open;
  }
 
  _close() {
    this.open = false;
  }
 
  render() {
    return html`
      <!-- Hamburger button -->
      <button
        class="hamburger ${this.open ? 'is-open' : ''}"
        @click=${this._toggle}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
 
      <!-- Overlay -->
      <div
        class="overlay ${this.open ? 'is-open' : ''}"
        @click=${this._close}
      ></div>
 
      <!-- Sidebar -->
      <aside class="sidebar ${this.open ? 'is-open' : ''}">
   <nav>
  ${this.links.map(link => html`
    <a href="${link.href}" @click=${this._close}>${link.label}</a>
  `)}
</nav>
      </aside>
    `;
  }
}
 
customElements.define('hamburger-menu', HamburgerMenu);
 