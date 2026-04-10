import { LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import AccessAttemptResultCSS from '../AccessAttemptResult/AccessAttemptResultCSS.css' with { type: 'css' };
export class AccessAttemptResult extends LitElement {
  static properties = {
    open: { type: Boolean },
    links: { type: Array },
  };

  static styles = [ResetCSS, AccessAttemptResultCSS];
   constructor() {
    super();
    this.open = false;
      this.links = [];
  }
 
  _toggle() {
    this.open = !this.open;
  }
 
  _close() {
    this.open = false;
  }
 
  render() {
    return html`
     <p>access-attempt-result</p>
    `;
  }
}
 
customElements.define('access-attempt-result', AccessAttemptResult);
 