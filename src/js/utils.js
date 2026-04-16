import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './clases/HttpError.js'
import { supabase } from '../config/supabaseClient.js';

const TIMEOUT = 10000

export const API_PORT = location.port ? `:${1337}` : ''
export const SSID = JSON.parse(sessionStorage.getItem('user'))?._id || null

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

export function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */(inputElement).value
  } else {
    return ''
  }
}

export function launchpreCartPoPup(ing) {
    console.log('buy ingredient function activated by the click', ing);

    window.dispatchEvent(new CustomEvent('ingredient-selected', {
      detail: ing,
      bubbles: true,
      composed: true
    }));

  } 

export async function checkLoggedIn() {
  const restrictedPages = ['/src/cart.html', '/src/shop.html', '/src/chooserecipe.html', '/src/calculator.html', '/src/user.html'];
  const accessPages = ['/src/index.html', '/src/sign.html', '/src/login.html'];

  const { data: { session } } = await supabase.auth.getSession();

  if (restrictedPages.includes(location.pathname) && !session) {
    location.href = './index.html';
  } else if (accessPages.includes(location.pathname) && session) {
    location.href = './user.html';
  }
}