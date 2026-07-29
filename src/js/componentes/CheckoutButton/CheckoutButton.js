import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CheckoutButtonCSS from '../CheckoutButton/CheckoutButtonCSS.css' with { type: 'css' };
export class CheckoutButton extends LitElement {
  static properties = {
    nome: { type: String },
    email: { type: String },
    prodotti: { type: Array },
    totale: { type: Number },
    endpoint: { type: String }, // permette di sovrascrivere l'url se serve
    stato: { state: true }, // 'idle' | 'invio' | 'successo' | 'errore'
    messaggioErrore: { state: true },
  };

  static styles = [ResetCSS, CheckoutButtonCSS];


  constructor() {
    super();
    this.nome = '';
    this.email = '';
    this.prodotti = [];
    this.totale = 0;
    this.endpoint = '/api/ordine';
    this.stato = 'idle';
    this.messaggioErrore = '';
  }

  async _confermaOrdine() {
    if (this.stato === 'invio') return;

    // Validazione minima lato client
    if (!this.nome || !this.email || !this.prodotti?.length) {
      this.stato = 'errore';
      this.messaggioErrore = 'Dati ordine incompleti';
      return;
    }

    this.stato = 'invio';
    this.messaggioErrore = '';

    // Notifica al resto dell'app che l'invio è partito (utile per mostrare loading altrove)
    this.dispatchEvent(
      new CustomEvent('ordine-invio-iniziato', { bubbles: true, composed: true })
    );

    try {
      const risposta = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: this.nome,
          email: this.email,
          prodotti: this.prodotti,
          totale: this.totale,
        }),
      });

      const dati = await risposta.json();

      if (risposta.ok && dati.success) {
        this.stato = 'successo';
        this.dispatchEvent(
          new CustomEvent('ordine-completato', {
            detail: dati,
            bubbles: true,
            composed: true,
          })
        );
      } else {
        this.stato = 'errore';
        this.messaggioErrore = dati.error || 'Errore durante invio ordine';
        this.dispatchEvent(
          new CustomEvent('ordine-fallito', {
            detail: dati,
            bubbles: true,
            composed: true,
          })
        );
      }
    } catch (err) {
      this.stato = 'errore';
      this.messaggioErrore = 'Impossibile contattare il server';
      this.dispatchEvent(
        new CustomEvent('ordine-fallito', {
          detail: { error: err.message },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <button class="checkout-button"
        ?disabled=${this.stato === 'invio'}
        @click=${this._confermaOrdine}
      >
        ${this.stato === 'invio' ? 'Invio in corso…' : 'Conferma ordine'}
      </button>

      ${this.stato === 'successo'
        ? html`<p class="messaggio successo">
            ✅ Ordine confermato! Controlla la tua email.
          </p>`
        : ''}
      ${this.stato === 'errore'
        ? html`<p class="messaggio errore">❌ ${this.messaggioErrore}</p>`
        : ''}
    `;
  }
}

customElements.define('checkout-button', CheckoutButton);