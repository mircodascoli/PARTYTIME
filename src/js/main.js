 //@ts-no-check
import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './clases/HttpError.js'
export const API_PORT = location.port ? `:${1337}` : ''
const TIMEOUT = 10000

window.addEventListener('DOMContentLoaded', DomContentLoaded)

function DomContentLoaded() {
  
  let formLogOut = document.getElementById('logOutButton')
  let formSignout = document.getElementById('signOutButton')
  let bodyCalculator = document.getElementById('body-calculadores')
  let bodyUser = document.getElementById('bodyUser')
  let signInFormLit = document.querySelector('signin-form-lit')
  let LogInFormLit = document.querySelector('log-in-form-lit')
  let bodyChoose = document.getElementById('bodyChoose') 
  let hamMenu= document.getElementById('hamMenu')
  let xButton = document.getElementById('xButton')
  let underlay = document.getElementById('underlay')
  let CocktailListComp = document.querySelector('cocktail-list')
  let MyRecipesComp = document.querySelector('my-recipes')

  window.addEventListener('ingredient-selected', (e) => {
    openPreCart(e.detail);
   });

  formLogOut?.addEventListener('click', onLogOut)
  formSignout?.addEventListener('click', onSignOut)
  hamMenu?.addEventListener('click',openSideBar)
  xButton ?.addEventListener('click',closeSideBar)   

  CocktailListComp?.addEventListener('item-selected', (e) => {
    openPopUp(e.detail);
   });
   MyRecipesComp?.addEventListener('ingredient-selected', (e) => {
    openPreCart(e.detail);
   });
   if (bodyCalculator != null){
      console.log('body calculadoraencontrado, display calculadora') 
      document.addEventListener('receta-guardada', () => {
        location.href = './user.html';
      });
    }
    if (bodyUser != null){
      console.log('body userencontrado, weloming user')
      welcoming()
    }
    if (bodyChoose != null){
      console.log('body chooseencontrado, display choosepoison')
      document.addEventListener('craft-selected', (event) => {
 
     SetCocktailToSS(event.detail);

     redirectToCalculator();

    });

    }

  underlay?.addEventListener('click', closeSideBar)
  signInFormLit?.addEventListener('signin-form-submit', (event) => {
    if (event?.detail?.text === 'User already exists') {
    console.log('ponemos el cartel de user existente')
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
    }
    
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
  }


function checkLoggedIn() {
  const restrictedPages = ['/carrito.html', '/productos.html', '/choosepoison.html', '/calculadores.html', '/user.html'];
  const accessPages = ['/index.html', '/signin.html', '/login.html'];
  if (restrictedPages.includes(location.pathname) && sessionStorage.getItem('user') == null) {
    location.href = './index.html'
  } else if (accessPages.includes(location.pathname) && sessionStorage.getItem('user') != null) {
    sessionStorage.setItem('user', null)
  }
}

function onLogOut(event) {
    event.preventDefault()
    // Eliminar la sesión del usuario
    sessionStorage.removeItem('user')
    location.href = './index.html'
  }

  function onSignOut() {
   console.log('borrar usuario')
    if (sessionStorage.getItem('user') && confirm('¿Estás seguro de borrar tu usuario?')) {
      let userId = JSON.parse(sessionStorage.getItem('user'))._id
      console.log(userId, typeof userId)
      let payload = JSON.stringify({ _id: userId })
      let apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/user/`, 'DELETE', payload);
      console.log(apiData)
       sessionStorage.removeItem('user')  
      alert('Usuario borrado correctamente') 
       location.href = './index.html' 
    }

  }

  function openSideBar(){
  console.log('lets open the menu')
  let underlay = document.getElementById('underlay')
  underlay?.classList.remove('hidden')
  let sideBar = document.querySelector('.sidebar')
  sideBar?.classList.add('active')
  }
  function closeSideBar(){
    console.log('lets close the menu')
    let underlay = document.getElementById('underlay')
    underlay?.classList.add('hidden')
    let sideBar = document.querySelector('.sidebar')
    sideBar?.classList.remove('active')
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

  function SetCocktailToSS(cocktail){
    console.log('setting cocktail to session storage', cocktail)
    sessionStorage.setItem('selectedCraft', JSON.stringify(cocktail))
  }
    
  function redirectToCalculator(){
    console.log('redirecting to calculator page')
    location.href = './calculator.html'
  }
export async function getAPIData(apiURL, method = 'GET', data) {
  let apiData

  try {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Access-Control-Allow-Origin', '*')
    if (data) {
      headers.append('Content-Length', String(JSON.stringify(data).length))
    }  
    apiData = await simpleFetch(apiURL, {
      // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(TIMEOUT),
      method: method,
      body: data ?? undefined,
      headers: headers
    });
  } catch (/** @type {any | HttpError} */err) {
    // En caso de error, controlamos según el tipo de error
    if (err.name === 'AbortError') {
      console.error('Fetch abortado');
    }
    if (err instanceof HttpError) {
      if (err.response.status === 404) {
        console.error('Not found');
      }
      if (err.response.status === 500) {
        console.error('Internal server error');
      }
    }
  }
  console.log(apiData, typeof apiData, 'data from getApiData' )
  return apiData
}

function welcoming(){
  let pWelcome = document.getElementById('welcome')
  let userName = JSON.parse(sessionStorage.getItem('user')).name
  pWelcome?.classList.add('p-welcome')
  pWelcome.textContent= `Welcome,
  ${userName}`
}

export function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */(inputElement).value
  } else {
    return ''
  }
}
