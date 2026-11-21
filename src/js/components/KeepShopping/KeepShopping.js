import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData, API_URL, getSSID } from '../../utils.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import KeepShoppingCSS from '../KeepShopping/KeepShoppingCSS.css' with { type: 'css' };
export class KeepShopping extends LitElement {
  static styles = [ResetCSS, KeepShoppingCSS];

  async keepShoppingButtonClicked() {
    console.log('2.5s after — emptying cart and reloading page');

    const body = {
      userId: getSSID(),
    };
    const PAYLOAD = JSON.stringify(body);

    try {
      const apiData = await getAPIData(
        `${API_URL}/api/clear/cart`,
        'DELETE',
        PAYLOAD
      );
      console.log('cart is cleared:', apiData);
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setTimeout(() => (window.location.href = './shop.html'), 1500);
    }
  }
  render() {
    return html`
      <div class="keep-shopping-container">
        <a
          class="keep-shopping-button"
          @click=${() => this.keepShoppingButtonClicked()}
        >
          <span>Keep Shopping</span>
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
            class="icon icon-tabler icons-tabler-outline icon-tabler-menu-deep"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 6h16" />
            <path d="M7 12h13" />
            <path d="M10 18h10" />
          </svg>
        </a>
      </div>
    `;
  }
}

customElements.define('keep-shopping', KeepShopping);
