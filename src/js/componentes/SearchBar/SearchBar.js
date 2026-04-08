import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import SearchBarCSS from '../SearchBar/SearchBarCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
export class SearchBar extends LitElement {
    static styles = [ResetCSS, SearchBarCSS];
  static properties = {
    cocktail: { type: Object }
  };

  render() {
    return html`
      <p>Search Bar Component</p>
    `;
  }
}

customElements.define('search-bar', SearchBar);