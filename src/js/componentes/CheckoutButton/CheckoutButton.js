import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CheckoutButtonCSS from '../CheckoutButton/CheckoutButtonCSS.css' with { type: 'css' };
import { getAPIData, API_PORT, getSSID } from '../../utils.js';
export class CheckoutButton extends LitElement {
  static properties = {
    name: { type: String },
    email: { type: String },
    products: { type: Array },
    total: { type: Number },
    endpoint: { type: String },
    status: { state: true },
    errorMessage: { state: true },
  };

  static styles = [ResetCSS, CheckoutButtonCSS];

  constructor() {
    super();
    this.name = '';
    this.email = '';
    this.products = [];
    this.total = 0;
    this.endpoint = '/api/order';
    this.status = 'idle';
    this.errorMessage = '';
    this._successTimeout = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._successTimeout);
  }

  async _confirmOrder() {
    if (this.status === 'sending') return;

    if (!this.name || !this.email || !this.products?.length) {
      this.status = 'error';
      this.errorMessage = 'Incomplete order data';
      return;
    }

    this.status = 'sending';
    this.errorMessage = '';

    this.dispatchEvent(
      new CustomEvent('order-sending-started', { bubbles: true, composed: true })
    );

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          products: this.products,
          total: this.total,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.status = 'success';
        this.dispatchEvent(
          new CustomEvent('order-completed', {
            detail: data,
            bubbles: true,
            composed: true,
          })
        );

        this._successTimeout = setTimeout(() => {
          this._afterSuccess();
        }, 2500);

      } else {
        this.status = 'error';
        this.errorMessage = data.error || 'Error while sending the order';
        this.dispatchEvent(
          new CustomEvent('order-failed', {
            detail: data,
            bubbles: true,
            composed: true,
          })
        );
      }
    } catch (err) {
      this.status = 'error';
      this.errorMessage = 'Could not reach the server';
      this.dispatchEvent(
        new CustomEvent('order-failed', {
          detail: { error: err.message },
          bubbles: true,
          composed: true,
        })
      );
    }
  }


 async _afterSuccess() {
  console.log('2.5s dopo il successo — svuoto il carrello');

  const body = {
    userId: getSSID(),
  };
  const PAYLOAD = JSON.stringify(body);

  try {
    const apiData = await getAPIData(
      `${location.protocol}//${location.hostname}${API_PORT}/api/clear/cart`,
      'DELETE',
      PAYLOAD
    );
    console.log('Carrello svuotato:', apiData);
  } catch (err) {
    console.error('Error clearing cart:', err);
  } finally {
    setTimeout(() => window.location.reload(), 1500);
  }
}
  

  render() {
    return html`
      <button class="checkout-button"
        ?disabled=${this.status === 'sending'}
        @click=${this._confirmOrder}
      >
        ${this.status === 'sending' ? 'Sending…' : 'Confirm order'}
      </button>
    `;
  }
}

customElements.define('checkout-button', CheckoutButton);