import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import CocktailListCSS from '../CocktailList/CocktailListCSS.css' with { type: 'css' }
import { cocktails } from '../../clases/Cocktails.js';
import { getAPIData, API_PORT } from '../../main.js';

export class CocktailList extends LitElement {
  static styles = [ResetCSS, CocktailListCSS];

  static properties = {
  
  };

  constructor() {
    super();

  }

  render() {
    return html`     
        <ul id="listCocktails">
                    <a data-modal-target="#description">
                    <li class="item-cocktail-list">
                   <img src="./img/negroni.jpeg" alt="Negroni" class="img-list-cocktails">
                        <h3 class="drink-name">Negroni</h3>
                    </li>
                    </a>
                    <a data-modal-target="#description">
                    <li class="item-cocktail-list">
                            <img src="./img/manhattan.jpeg" alt="Manhattan"  class="img-list-cocktails">
                            <h3 class="drink-name"> Manhattan</h3>
                    </li>
                   </a>
                    <a data-modal-target="#description">
                    <li class="item-cocktail-list">
                            <img src="./img/oldfash.jpeg" alt="Old Fashioned" class="img-list-cocktails">
                            <h3 class="drink-name">Old Fashioned</h3>
                    </li>
                </a>
                <a data-modal-target="#description">
                    <li class="item-cocktail-list">
                        <img src="./img/dry.jpeg" alt="Dry Martini" class="img-list-cocktails">
                        <h3 class="drink-name">Dry Martini</h3>
                    </li>
                </a>
             

            </div>
            
        
         
                    <a data-modal-target="#description">
                    <li class="item-cocktail-list">
                        <img src="./img/paloma.jpeg" alt="Paloma" class="img-list-cocktails">
                        <h3 class="drink-name">Paloma</h3>
                    </li>
                </a>
                <a data-modal-target="#description">
                    <li class="item-cocktail-list"> 
                        <img src="./img/dns.jpeg" alt="Dark and Stormy" class="img-list-cocktails">
                        <h3 class="drink-name">Dark & stormy</h3>
                    </li>
                </a>
                <a data-modal-target="#description">
                    <li class="item-cocktail-list">
                        <img src="./img/fizz.jpeg" alt="Gin Fizz" class="img-list-cocktails">
                        <h3 class="drink-name">Tom Collins</h3>
                    </li>
                </a>
                <a data-modal-target="#description">
                    <li class="item-cocktail-list">
                        <img src="./img/bluehigh.jpeg" alt="Berry hiball" class="img-list-cocktails">
                        <h3 class="drink-name">Berry hiball</h3>
                    </li>
                </a>
     </ul>
    `;
  }


 
}

customElements.define('cocktail-list', CocktailList);
