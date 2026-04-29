import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './clases/HttpError.js'
import { supabase } from '../config/supabaseClient.js';

const TIMEOUT = 10000

export const API_PORT = location.port ? `:${1337}` : ''
export const getSSID = () => JSON.parse(sessionStorage.getItem('user'))?._id || null;

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
      signal: AbortSignal.timeout(TIMEOUT),
      method: method,
      body: data ?? undefined,
      headers: headers
    });
  } catch (/** @type {any | HttpError} */err) {
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
  const restrictedPages = ['/cart.html', '/shop.html', '/chooserecipe.html', '/calculator.html', '/user.html'];
  const accessPages = ['/index.html', '/sign.html', '/login.html'];

  // 👇 aspetta la sessione reale prima di decidere
  const session = await getSessionWithFallback();

  if (restrictedPages.includes(location.pathname) && !session) {
    location.href = './index.html';
    return;
  }

  if (accessPages.includes(location.pathname) && session) {
    location.href = './user.html';
  }
}

async function getSessionWithFallback() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) return session; // sessione già disponibile, nessun problema

  // sessione non ancora pronta (post-redirect OAuth), aspetta INITIAL_SESSION
  return new Promise((resolve) => {
    const TIMEOUT_MS = 5000;

    const timer = setTimeout(() => {
      subscription.unsubscribe();
      resolve(null);
    }, TIMEOUT_MS);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        clearTimeout(timer);
        subscription.unsubscribe();
        resolve(session);
      }
    });
  });
}
export async function syncUserWithMongo() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return new Promise((resolve) => {
      const TIMEOUT_MS = 5000;

      const timer = setTimeout(() => {
        subscription.unsubscribe();
        resolve(null);
      }, TIMEOUT_MS);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          clearTimeout(timer);
          subscription.unsubscribe();

          if (session) {
            resolve(await _doSync(session.user));
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  return await _doSync(session.user);
}

async function _doSync(supabaseUser) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: supabaseUser.email })
  });

  console.log('status:', res.status);
  const text = await res.text();
  console.log('raw response:', text);

  const existingUser = text ? JSON.parse(text) : null;

  if (!existingUser) {
    const createRes = await fetch('/api/create/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: supabaseUser.user_metadata.full_name,
        email: supabaseUser.email,
        cart: [],
        recipes: []
      })
    });
    return await createRes.json();
  }

  return existingUser;
}