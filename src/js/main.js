 //@ts-no-check
//import { checkLoggedIn } from "./utils.js"// delete once login and sign are ready
window.addEventListener('DOMContentLoaded', DomContentLoaded)

function DomContentLoaded() {
  let CocktailListComp = document.querySelector('cocktail-list')// stays
  let MyRecipesComp = document.querySelector('my-recipes')// stays

  window.addEventListener('ingredient-selected', (e) => {openPreCart(e.detail)});// stays
  CocktailListComp?.addEventListener('item-selected', (e) => {openPopUp(e.detail)});// stays
  MyRecipesComp?.addEventListener('ingredient-selected', (e) => {openPreCart(e.detail)});// stays
 
 function openPopUp(data) {
    console.log(`lets open the popup for ${data.name}
      and description: ${data.description}`);
    let popUp = document.createElement('description-pop-up')
    popUp.cocktail = data;
    document.body.appendChild(popUp)
  }

  function openPreCart(data) {
    console.log(`lets open the popup for ${data.name}`);
    let preCart = document.createElement('pre-cart-popup')
    preCart.product = data;
    document.body.appendChild(preCart)
  }

}

 