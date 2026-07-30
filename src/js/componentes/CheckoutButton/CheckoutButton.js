import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import CheckoutButtonCSS from '../CheckoutButton/CheckoutButtonCSS.css' with { type: 'css' };

export class CheckoutButton extends LitElement {
  static properties = {
    name: { type: String },
    email: { type: String },
    products: { type: Array },
    total: { type: Number },
    endpoint: { type: String }, // lets you override the URL if needed
    status: { state: true }, // 'idle' | 'sending' | 'success' | 'error'
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
 
    // Let the rest of the app know sending has started (useful for external loading states)
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

  render() {
    console.log('CheckoutButton updated, total:', this.total, 'products:', this.products, 'name:', this.name, 'email:', this.email);
     return html`
      <button class="checkout-button"
        ?disabled=${this.status === 'sending'}
        @click=${this._confirmOrder}
      >
        ${this.status === 'sending' ? 'Sending…' : 'Confirm order'}
      </button>
 
      ${this.status === 'success'
        ? html`<p class="message success">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-mail-fast"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7h3" /><path d="M3 11h2" /><path d="M9.02 8.801l-.6 6a2 2 0 0 0 1.99 2.199h7.98a2 2 0 0 0 1.99 -1.801l.6 -6a2 2 0 0 0 -1.99 -2.199h-7.98a2 2 0 0 0 -1.99 1.801" /><path d="M9.8 7.5l2.982 3.28a3 3 0 0 0 4.238 .202l3.28 -2.982" /></svg>
             <span>Order confirmed! Check your email.</span>
          </p>`
        : ''}
      ${this.status === 'error'
        ? html`<p class="message error"> 
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-message-exclamation"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 9h8" /><path d="M8 13h6" /><path d="M15 18h-2l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5" /><path d="M19 16v3" /><path d="M19 22v.01" /></svg>
               <span>${this.errorMessage}</span>
             </p>`
        : ''}
    `;
  }
}

customElements.define('checkout-button', CheckoutButton);