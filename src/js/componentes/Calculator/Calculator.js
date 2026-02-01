import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import CalculatorCSS from '../Calculator/CalculatorCSS.css' with { type: 'css' };
import ResetCSS from '../../../css/reset.css' with { type: 'css' };
export class Calculator extends LitElement {
 static styles = [ResetCSS, CalculatorCSS];
  constructor() {
    super();
  }

  render() {
   return html`
          <div class="Calculador-Container">
            <h2>Calculador Component</h2>
          </div>
    `;
  }
}

customElements.define('calculator-component', Calculator);