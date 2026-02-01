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
  let bodyProductos = document.getElementById('bodyProductos')
  let bodyUser = document.getElementById('bodyUser')
  let formBusqueda =  document.getElementById('formBusqueda')
  let botonBuscar = document.getElementById('botonBuscar')
  let overlay = document.getElementById('overlay') 
  let signInFormLit = document.querySelector('signin-form-lit')
  let LogInFormLit = document.querySelector('log-in-form-lit')
  let bodyCarrito = document.getElementById('bodyCarrito')
  let bodyChoose = document.getElementById('bodyChoose') 
  let hamMenu= document.getElementById('hamMenu')
  let xButton = document.getElementById('xButton')
  let underlay = document.getElementById('underlay')
  let deleteButton = document.querySelector('.delete-button')
  let CocktailListComp = document.querySelector('cocktail-list')

  formLogOut?.addEventListener('click', onLogOut)
  formSignout?.addEventListener('click', onSignOut)
  botonBuscar?.addEventListener('click', buscarProducto)
  formBusqueda?.addEventListener('submit', buscarProducto)
  formBusqueda?.addEventListener('keyup', onInputKeyUp)
  hamMenu?.addEventListener('click',openSideBar)
  xButton ?.addEventListener('click',closeSideBar)   
  deleteButton?.addEventListener('click', deleteItemFromCart) 
  CocktailListComp?.addEventListener('item-selected', (e) => {
    openPopUp(e.detail);
});

    if (bodyProductos != null){
      console.log('body encontrado, display productos') 
      displayProductos()
    }
   if (bodyCalculator != null){
      console.log('body calculadoraencontrado, display calculadora') 
    }
    if (bodyUser != null){
      console.log('body userencontrado, weloming user') 
      welcoming()
    }
    if (bodyCarrito != null){
      console.log('body carritoencontrado, display carrito') 
     loadCartData()
    }
    if (bodyChoose != null){
      console.log('body chooseencontrado, display choosepoison')
      document.addEventListener('craft-selected', (event) => {
  console.log('Evento ricevuto dal popup:', event.detail);

  // Prima reindirizzi
  redirecToCalculator();

  // Poi apri la calcolatrice con i dati del cocktail
  SetCocktailToSS(event.detail);
}); 
    }

    overlay?.addEventListener('click', () => {
      const activePopUps = document.querySelectorAll('.description.active');
      activePopUps.forEach((popUp) => closePopup(popUp));
    })

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

  function redirecToCalculator() {
    console.log('redirecting to calculator page')
    location.href = './calculadores.html'
  }
  function SetCocktailToSS(cocktail){
    console.log('setting cocktail to session storage', cocktail)
    sessionStorage.setItem('selectedCocktail', JSON.stringify(cocktail))
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

async function displayProductos() {
 try { 
  const listaProductos = document.getElementById('listaProductos'); 

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/botellas`, 'GET');
    
    console.log(apiData);

    apiData.forEach((botella) => {
      const producto = document.createElement('li');
      
      // Crea il bottone
      const button = document.createElement('button');
      button.textContent = 'Add to cart';
      button.classList.add('addToCart'); // Classe invece dell'id
      button.dataset.id = botella._id; // Usa dataset per salvare l'id

      // Aggiungi l'event listener direttamente qui
      button.addEventListener('click', () => {
        addToCart(botella._id); // Funzione da scrivere a parte
      });

      // Crea l'HTML del resto
      producto.innerHTML = `
       
        <img src="../img/imgProductos/${botella.name}.png" alt="${botella.name}">
        <h3>${botella.name}</h3>
        <p class="price">${botella.price} &euro;</p>
      `;

      producto.appendChild(button); // Aggiungi il bottone creato
      listaProductos.appendChild(producto);
    });
 
  } catch (error) {
    console.error('Errore durante la richiesta API:', error);
  } 
}

async function buscarProducto(event) {
  event.preventDefault();

  try {
    const listaProductos = document.getElementById('listaProductos');
    const InputBusqueda = document.getElementById('busqueda');
    const valorBusqueda = InputBusqueda?.value.trim(); // rimuove spazi iniziali/finali

    if (valorBusqueda === '') {
      alert('Debes ingresar un nombre de producto');
      return;
    }

    const newBotella = { name: valorBusqueda };
    const payload = JSON.stringify(newBotella);

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/busqueda`, 'POST', payload);

    if (apiData.length === 0) {
      alert('Producto no encontrado');
      return;
    }

   
    listaProductos.innerHTML = '';

    apiData.forEach((botella) => {
      const producto = document.createElement('li'); 

      producto.innerHTML = `
        <img src="../img/imgProductos/${botella.name}.png" alt="${botella.name}">
        <h3>${botella.name}</h3>
        <p class="price">${botella.price} &euro;</p>
      `;

      const button = document.createElement('button');
      button.textContent = 'Add to cart';
      button.classList.add('addToCart');
      button.dataset.id = botella._id;
     

      button.addEventListener('click', () => {
        addToCart(botella._id);
      });

      producto.appendChild(button);
      listaProductos?.appendChild(producto);
    });

  } catch (error) {
    console.error('Errore durante la richiesta API:', error);
  }
}


function onInputKeyUp(event) {// Keyup: mirar teclas pulsadas
  console.log(event.key)
   const listaProductos = document.getElementById('listaProductos');
   
  let formBusqueda  = document.getElementById('busqueda')
  if(formBusqueda?.value  === ''){
    while (listaProductos?.firstChild) {
      listaProductos.removeChild(listaProductos.firstChild)
    }
    displayProductos()
  }
}

async function addToCart(id){
try{
  console.log('add to cart',id)
  const idUserNum = JSON.parse(sessionStorage.getItem('user'))._id
  const idBotellaNum = id
  const body = {
  idUser : idUserNum,
  idBotella: idBotellaNum,
 
}
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/push/to/cart`, 'POST', payload);
  alert('Added to your cart!')
    console.log(apiData)
    location.href = './carrito.html';

}
catch (error) {
  console.error('Error during botton click:', error);
}

}

 async function loadCartData() {

  const idUserNum = JSON.parse(sessionStorage.getItem('user'))._id
  console.log('Loading the data', idUserNum);

  try {
    const payload = JSON.stringify({ id: idUserNum });
    console.log(payload);
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/buscar/usuario`, 'POST', payload);
   console.log(apiData);
    let idsInCart = apiData.cart;
    console.log(idsInCart);
   getbottlesFromShop(idsInCart)

    
  } catch (error) {
    console.error('Error during botton click:', error);
  }

}


  async function getbottlesFromShop(idsInCart) {
  console.log('up next getting this bottles from shop',idsInCart);

 try{
 
  const payloadCart = JSON.stringify({ ids: idsInCart });
  console.log(payloadCart);
  const apiDataCart = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/busqueda/cart`, 'POST', payloadCart);
     console.log(apiDataCart,typeof apiDataCart);
     if (apiDataCart.length === 0) {
  alert('No product found in DB');
  return;
}
const cartList = document.getElementById('carrito');
apiDataCart.forEach((botella) => {
  const producto = document.createElement('li'); 
  producto.innerHTML = `
      
        <img src="../img/imgProductos/${botella.name}.png" alt="${botella.name}">
        <h3>${botella.name}</h3>
        <p class="price">${botella.price} &euro;</p>
        <a href="./external.html"><button>BUY</button></a>
      `;
     cartList?.appendChild(producto)
     const button = document.createElement('button');
      button.textContent = 'X';
      button.classList.add('delete-button');
      button.dataset.id = botella._id;
      let idBotellaNum = button.dataset.id 
      console.log(button.dataset.id,`botella.dataset.id`);
      button.addEventListener('click', () => {
        deleteItemFromCart(idBotellaNum);
      });
     
      producto.appendChild(button);
  
    
    
})

    let ClearCartButton = document.createElement('button');
    let clearBtnContainer = document.querySelector('#clearBtnContainer')
    ClearCartButton.textContent = 'Clear Cart';
    ClearCartButton.classList.add('clear');
     clearBtnContainer?.appendChild(ClearCartButton);
    ClearCartButton.addEventListener('click', () => {
      clearCart();
    })
     }catch (error) {
    console.error('Error during botton click:', error);
     }
}
 
function deleteItemFromCart(idBotellaNum){
  console.log('delete from crt event lauched')
let userId = JSON.parse(sessionStorage.getItem('user'))._id
console.log(userId, idBotellaNum)

  const body = {
  idUser : userId,
  idBotella: idBotellaNum, 
 
}
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/from/cart`, 'DELETE', payload);
  console.log(apiData)
location.reload();

}

function clearCart(){
  console.log('clear cart event lauched')
  let userId = JSON.parse(sessionStorage.getItem('user'))._id
  console.log(userId)
  const body = {
    userId
  }
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/cart`, 'DELETE', payload);
  console.log(apiData)
  alert('Cart cleared!')
  location.reload(); 
}

function welcoming(){
  let pWelcome = document.getElementById('welcome')
  let userEmail = JSON.parse(sessionStorage.getItem('user')).email
  pWelcome?.classList.add('p-welcome')
  pWelcome.textContent= `Welcome,
  ${userEmail}`
}

export function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */(inputElement).value
  } else {
    return ''
  }
}
