import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData, getInputValue, API_PORT } from '../../main.js';
import ResetCSS from '../../../css/reset.css' with {type: 'css'};
import SignInFormLitCSS from '../SignInFormLit/SignInFormLit.css'with {type: 'css'};
export class SignInFormLit extends LitElement {
    static styles = [ResetCSS, SignInFormLitCSS];
    static properties = {
    name: { type: String },
    email: { type: String },
    password: { type: String },
  }

 constructor() {
    super();
    this.name = '';
    this.email = '';
    this.password = '';
  }

    render() {
        return html`
            <form id="formLog" @submit="${this._onFormSubmit}">
                <slot></slot>
                <p id="infoMessage">Register your account</p>
                <input type="name" id="nameSign" placeholder="Name" required>
                <input type="email" id="emailSign" placeholder="Email" required>
                <input type="password" id="passwordSign" placeholder="Password" required>
                <button type="submit" class="btn">Sign In</button>
                <a href="./login.html" class="login-or-sign">Or login</a>
            </form>
        `;
       
        }

        async _onFormSubmit(e) {
          console.log('onFormSubmit activation')
            e.preventDefault();
            const name = this.renderRoot.getElementById('nameSign');
            const email = this.renderRoot.getElementById('emailSign');
            const password = this.renderRoot.getElementById('passwordSign')
            

            const signInData  = {
              name: getInputValue(name),
              email: getInputValue(email),
              password: getInputValue(password)
            }

           let onFormSubmitEvent
          
             console.log(`DESDE DENTRO DEL COMPONENTE Name: ${signInData.name}, Email: ${signInData.email}, Email: ${signInData.password}`);

             if (signInData.email !== '' && signInData.password !== '') {

                const payload = JSON.stringify(signInData)
                const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/users`, 'POST', payload)
                console.log(apiData)
                let eventDetail = apiData

                   if (apiData === undefined) { 

                         eventDetail = { text: 'User already exists',}
                        }
  
      onFormSubmitEvent = new CustomEvent("signin-form-submit", {
        bubbles: true,
        detail: eventDetail
      })
    } else {
      console.error('No se han enviado datos')
      onFormSubmitEvent = new CustomEvent("signin-form-submit", {
        bubbles: true,
        detail: {
          text: 'No se han enviado los datos del formulario'
        }
      })
    }

     this.dispatchEvent(onFormSubmitEvent);
  }
    }

customElements.define('signin-form-lit', SignInFormLit);