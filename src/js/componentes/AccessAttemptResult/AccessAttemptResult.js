import { LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import AccessAttemptResultCSS from '../AccessAttemptResult/AccessAttemptResultCSS.css' with { type: 'css' };
export class AccessAttemptResult extends LitElement {
  static properties = {
   message : {type: String},
  };

  static styles = [ResetCSS, AccessAttemptResultCSS];
   constructor() {
    super();
    this.message = '';
  }

 
  render() {
    if (!this.message) return html`<p>No message to display</p>`;
    
    return html`
     <p>${this.message}</p>
    `;
  }
}
 
customElements.define('access-attempt-result', AccessAttemptResult);
 