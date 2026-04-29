//@ts-no-check
import { checkLoggedIn, syncUserWithMongo } from "./utils.js"
import { supabase } from '../config/supabaseClient.js' // 👈 adatta il path

window.addEventListener('DOMContentLoaded', DomContentLoaded)

async function DomContentLoaded() {
  console.log('1. DOMContentLoaded fired');

  const { data: { session } } = await supabase.auth.getSession();
  console.log('2. session immediata:', session);

  await checkLoggedIn();
  console.log('3. checkLoggedIn done');

  const mongoUser = await syncUserWithMongo();
  console.log('4. mongoUser:', mongoUser);
  
  if (mongoUser) {
    sessionStorage.setItem('user', JSON.stringify(mongoUser));
    console.log('5. sessionStorage user:', sessionStorage.getItem('user'));
  } else {
    console.log('5. mongoUser è null, sessionStorage NON aggiornato');
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

 