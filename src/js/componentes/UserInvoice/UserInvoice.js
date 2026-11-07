import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import UserInvoiceCSS from '../UserInvoice/UserInvoiceCSS.css' with { type: 'css' };

export class UserInvoice extends LitElement {
  static styles = [ResetCSS, UserInvoiceCSS];

  static properties = {

  };


  render() {
   
    return html`
        <div class="">
  USERINVOICE   USERINVOICE   USERINVOICE 
        </div>
    `;
  }
 
}

customElements.define('user-invoice', UserInvoice);
