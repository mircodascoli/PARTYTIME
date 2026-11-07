
import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import UserInvoiceCSS from '../UserInvoice/UserInvoiceCSS.css' with { type: 'css' };

import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@4.2.1/+esm';

import {
  getAPIData,
  API_URL,
  getSSID,
  getSSNAME,
  formatPrice,
} from '../../utils.js';

export class UserInvoice extends LitElement {
  static styles = [ResetCSS, UserInvoiceCSS];

  static properties = {
    total: { type: Number },
    products: { type: Array },
    loading: { type: Boolean },
  };

  constructor() {
    super();

    this.total = 0;
    this.products = [];
    this.loading = true;

    try {
      this._idSession = getSSID();
    } catch {
      console.warn('No user logged');
      this._idSession = null;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadApiData();
  }

  async loadApiData() {
    if (!this._idSession) {
      this.loading = false;
      return;
    }

    try {
      const apiData = await getAPIData(
        `${API_URL}/api/buscar/usuario`,
        'POST',
        JSON.stringify({ id: this._idSession })
      );

      const enrichedCart = await Promise.all(
        apiData.cart.map(async (item) => {
          const details = await getAPIData(
            `${API_URL}/api/find/bottles/${item._id}`,
            'GET'
          );

          return { ...item, ...details };
        })
      );

      this.products = enrichedCart;

      this.total = enrichedCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    } catch (err) {
      console.error('Error loading invoice data:', err);
    } finally {
      this.loading = false;
    }
  }

  generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Partytime - Order Invoice', 20, 20);

    doc.setFontSize(11);
    doc.text(`Customer: ${getSSNAME() || 'Customer'}`, 20, 35);
    doc.text(`Email: ${getSSEMAIL() || ''}`, 20, 42);

    let y = 60;

    this.products.forEach((item) => {
      doc.text(item.name, 20, y);
      doc.text(`Qty: ${item.quantity}`, 110, y);
      doc.text(formatPrice(item.price), 150, y);

      y += 10;
    });

    doc.setFontSize(14);
    doc.text(`Total: ${formatPrice(this.total)}`, 20, y + 10);

    doc.save('partytime-invoice.pdf');
  }

  render() {
    return html`
      <div class="user-invoice-container">
        <h2>Thank you, ${getSSNAME()} here is your invoice</h2>

        ${
          this.loading
            ? html`<p>Loading invoice...</p>`
            : this.products.length === 0
              ? html`<p>No order data found.</p>`
              : html`
                  <ul>
                    ${this.products.map(
                      (item) => html`
                        <li>
                          ${item.name} — ${item.quantity} ×
                          ${formatPrice(item.price)}
                        </li>
                      `
                    )}
                  </ul>

                  <p>Total: ${formatPrice(this.total)}</p>

                  <button @click=${this.generatePDF}>
                    Download Invoice PDF
                  </button>
                `
        }

        <a @click=${() => (window.location.href = './user.html')}>
          keep shopping
        </a>
      </div>
    `;
  }
}

customElements.define('user-invoice', UserInvoice);
