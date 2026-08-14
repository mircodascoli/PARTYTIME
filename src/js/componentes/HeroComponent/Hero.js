import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import HeroCSS from '../HeroComponent/HeroCSS.css' with { type: 'css' };

export class Hero extends LitElement {
  static styles = [ResetCSS, HeroCSS];

  static properties = {
    _animate: { type: Boolean, state: true }
  };

  constructor() {
    super();
    this._animate = false;
  }

  connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(() => {
      setTimeout(() => {
        this._animate = true;
      }, 600);
    });
  }

  render() {
    return html`
      <section class="hero ${this._animate ? 'is-animating' : ''}">
        <img
          class="hero-logo"
          src="../../img/logo.svg"
          alt="Logo"
        />
        <div class="hero-buttons">
          <button class="hero-btn hero-btn-primary">Login</button>
          <button class="hero-btn hero-btn-secondary">Sign up</button>
        </div>
      </section>
    `;
  }
}

customElements.define('hero-component', Hero);