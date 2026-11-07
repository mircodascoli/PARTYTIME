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

    // Logo Partytime
    const logo = new Image();
    logo.src = '../../img/logo.png';

    await new Promise((resolve, reject) => {
      logo.onload = resolve;
      logo.onerror = reject;
    });

    // Intestazione
    doc.addImage(logo, 'PNG', 20, 12, 30, 30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PARTYTIME', 60, 23);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Order Invoice', 60, 31);

    doc.setDrawColor(180, 180, 180);
    doc.line(20, 48, 190, 48);

    // Titolo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('INVOICE', 20, 62);

    // Dati cliente
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    doc.text(`Customer: ${getSSNAME()}`, 20, 75);
    doc.text(`Email: ${getSSEMAIL()}`, 20, 82);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 89);

    // Tabella prodotti
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

      // Nuova pagina se necessario
      if (y > 265) {
        doc.addPage();
        y = 25;
      }
    });

    // Linea separatrice
    y += 3;
    doc.setDrawColor(180, 180, 180);
    doc.line(20, y, 190, y);

    // Totale ordine
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`TOTAL: ${formatPrice(this.total)}`, 190, y, {
      align: 'right',
    });

    // Piè di pagina
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
        <h2>Thank you, ${getSSNAME()} here is your invoice</h2>

        ${
          this.loading
            ? html`<p>Loading invoice...</p>`
            : this.products.length === 0
              ? html`<p>No order data found.</p>`
              : html`
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
