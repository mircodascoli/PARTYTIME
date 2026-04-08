import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import SearchBarCSS from '../SearchBar/SearchBarCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import { getAPIData, API_PORT } from '../../main.js';
export class SearchBar extends LitElement {
    static styles = [ResetCSS, SearchBarCSS];
    static properties = {
    loading: { type: Boolean },
    error:   { type: String  },
    query:   { type: String  },
  };

constructor() {
    super();
    this.loading = false;
    this.error   = '';
    this.query   = '';
  }
  _handleInput(e) {
    this.query = e.target.value;
  if (this.query.trim() === '') {
    this.dispatchEvent(
      new CustomEvent('search-reset', {
        bubbles:  true,
        composed: true,
      })
    );
  }
  }
 
  async _handleSearch(e) {
    e.preventDefault();
 
    const searchedValue = this.query.trim();
 
    if (!searchedValue) {
      this.error = 'Insert product name or spirit to search';
      return;
    }
 
    this.error   = '';
    this.loading = true;
    const payload = JSON.stringify({ name: searchedValue });

 
    try {
      let data = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/search`, 'POST', payload)
 
      if (data.length === 0) {
        this.error = 'Producto no encontrado';
        return;
    
      }
     console.log(data)
      this.dispatchEvent(
        new CustomEvent('search-results', {
          detail:   { results: data, query: searchedValue },
          bubbles:  true,
          composed: true,
        })
      );
 
    } catch (err) {
      this.error = `Error al buscar: ${err.message}`;
    } finally {
      this.loading = false;
    }
  }
 
  render() {
    return html`
      <form class="search-wrapper" @submit=${this._handleSearch}>
        <input
          type="text"
          placeholder="Buscar producto..."
          .value=${this.query}
          @input=${this._handleInput}
          ?disabled=${this.loading}
        />
        <button type="submit" ?disabled=${this.loading}>
          ${this.loading ? 'Buscando…' : 'Buscar'}
        </button>
      </form>
 
      ${this.error ? html`<p class="error">${this.error}</p>` : ''}
    `;
  }
}
 
customElements.define('search-bar', SearchBar);