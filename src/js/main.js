 //@ts-no-check
import { checkLoggedIn, syncUserWithMongo } from "./utils.js"

window.addEventListener('DOMContentLoaded', DomContentLoaded)

 async function DomContentLoaded() {
  await checkLoggedIn();

  const mongoUser = await syncUserWithMongo();
  console.log('mongoUser:', mongoUser);
  
  if (mongoUser) {
    sessionStorage.setItem('user', JSON.stringify(mongoUser));
  }
  window.addEventListener('ingredient-selected', (e) => {openPreCart(e.detail)});
  window.addEventListener('item-selected', (e) => {openPopUp(e.detail)});
}

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

 