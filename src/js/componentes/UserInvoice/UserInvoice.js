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
  getSSEMAIL,
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

  async generatePDF() {
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = '../../img/logo.png';

    await new Promise((resolve, reject) => {
      logo.onload = resolve;
      logo.onerror = reject;
    });

    doc.addImage(logo, 'PNG', 20, 12, 30, 30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PARTYTIME', 60, 23);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Order Invoice', 60, 31);

    doc.setDrawColor(180, 180, 180);
    doc.line(20, 48, 190, 48);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('INVOICE', 20, 62);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    doc.text(`Customer: ${getSSNAME()}`, 20, 75);
    doc.text(`Email: ${getSSEMAIL()}`, 20, 82);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 89);

    let y = 108;

    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 7, 170, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.text('Product', 23, y);
    doc.text('Qty', 125, y);
    doc.text('Unit price', 145, y);
    doc.text('Total', 175, y);

    y += 12;

    doc.setFont('helvetica', 'normal');

    this.products.forEach((product) => {
      const productTotal = product.price * product.quantity;

      doc.text(String(product.name), 23, y);
      doc.text(String(product.quantity), 125, y);
      doc.text(formatPrice(product.price), 145, y);
      doc.text(formatPrice(productTotal), 175, y);

      y += 10;

      if (y > 265) {
        doc.addPage();
        y = 25;
      }
    });

    y += 3;
    doc.setDrawColor(180, 180, 180);
    doc.line(20, y, 190, y);

    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`TOTAL: ${formatPrice(this.total)}`, 190, y, {
      align: 'right',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);

    doc.text('Thank you for shopping with Partytime!', 105, 285, {
      align: 'center',
    });

    doc.save('partytime-invoice.pdf');
  }

  render() {
    return html`
      <div class="user-invoice-container">
        <div class="user-invoice-text">
          <span class="user-invoice-thanks-span">Thank you,</span>
          <span class="user-invoice-name-span"> ${getSSNAME()}</span>
          <span class="user-invoice-phrase-span"> here is your invoice: </span>
        </div>

        ${
          this.loading
            ? html`<p>Loading invoice...</p>`
            : this.products.length === 0
              ? html`<p>No order data found.</p>`
              : html`
                  <div class="user-invoice-buttons-container">
                    <button class="download-button" @click=${this.generatePDF}>
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
                        class="icon icon-tabler icons-tabler-outline icon-tabler-file-download"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path
                          d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"
                        />
                        <path d="M12 17v-6" />
                        <path d="M9.5 14.5l2.5 2.5l2.5 -2.5" />
                      </svg>
                      <span>Download Invoice PDF</span>
                    </button>
                    <p>or</p>
                    <a
                      class="keep-shopping-button"
                      @click=${() => (window.location.href = './shop.html')}
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
                `
        }
      </div>
    `;
  }
}

customElements.define('user-invoice', UserInvoice);
