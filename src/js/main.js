 //@ts-no-check

window.addEventListener('DOMContentLoaded', DomContentLoaded)

function DomContentLoaded() {
  

  let signInFormLit = document.querySelector('signin-form-lit')// cambiare nome e ricontrollare funzioni
  let LogInFormLit = document.querySelector('log-in-form-lit') // cambiare nome e ricontrollare funzioni
  let CocktailListComp = document.querySelector('cocktail-list')// stays
  let MyRecipesComp = document.querySelector('my-recipes')// stays

  window.addEventListener('ingredient-selected', (e) => {openPreCart(e.detail)});// stays
  CocktailListComp?.addEventListener('item-selected', (e) => {openPopUp(e.detail)});// stays
  MyRecipesComp?.addEventListener('ingredient-selected', (e) => {openPreCart(e.detail)});// stays
  window.addEventListener('craft-selected', (event) => {SetCocktailToSS(event.detail); redirectToCalculator();});// questo lo puo fare il componente??

  signInFormLit?.addEventListener('signin-form-submit', (event) => {
    if (event?.detail?.text === 'User already exists') {
    document.getElementById('already')?.classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('already')?.classList.add('hidden')
    }, 1500)
    }else{
      console.log('ponemos el cartel de user registrado')
    document.getElementById('registered')?.classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('registered')?.classList.add('hidden')
    }, 1500)
    }// questo puo farlo il componente 
    
  })

  LogInFormLit?.addEventListener('login-form-submit', (event) => {
  const { success, data, error } = event?.detail || {};

  if (success) {
    console.log('Login ok:', data);
    document.getElementById('logged')?.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('logged')?.classList.add('hidden');
    }, 500);
  } else {
    console.warn('Login fail', error);
    document.getElementById('rejected')?.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('rejected')?.classList.add('hidden');
    }, 1500);
  }
})
  checkLoggedIn() 
  }// spostare logica nel component


function checkLoggedIn() {
  const restrictedPages = ['/carrito.html', '/productos.html', '/choosepoison.html', '/calculadores.html', '/user.html'];
  const accessPages = ['/index.html', '/signin.html', '/login.html'];
  if (restrictedPages.includes(location.pathname) && sessionStorage.getItem('user') == null) {
    location.href = './index.html'
  } else if (accessPages.includes(location.pathname) && sessionStorage.getItem('user') != null) {
    sessionStorage.setItem('user', null)
  }
}// questa rimane, ma sarebbe meglio fare un componente che gestisce l'autenticazione e le pagine accessibili in base allo stato di login

 function openPopUp(data) {
    console.log(`lets open the popup for ${data.name}
      and description: ${data.description}`);
    let popUp = document.createElement('description-pop-up')
    popUp.cocktail = data;
    document.body.appendChild(popUp)
  }// questo rimane

  function openPreCart(data) {
    console.log(`lets open the popup for ${data.name}`);
    let preCart = document.createElement('pre-cart-popup')
    preCart.product = data;
    document.body.appendChild(preCart)
  }// perche ci sono due funzioni praticamente identiche? 
  //questa rimane viene chiamata dallévento

  function SetCocktailToSS(cocktail){
    console.log('setting cocktail to session storage', cocktail)
    sessionStorage.setItem('selectedCraft', JSON.stringify(cocktail))
  }// questo lo puo fare il componente
  function redirectToCalculator(){
    console.log('redirecting to calculator page')
    location.href = './calculator.html'
  }// questo lo puo fare il componente


