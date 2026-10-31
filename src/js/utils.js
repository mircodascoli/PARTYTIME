import { simpleFetch } from './lib/simpleFetch.js';
import { HttpError } from './clases/HttpError.js';
import { supabase } from '../config/supabaseClient.js';

const TIMEOUT = 10000;

export const API_URL =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:1337'
    : 'https://partytime-5tie.onrender.com';
export const getSSID = () =>
  JSON.parse(sessionStorage.getItem('user'))?._id || null;
export const getSSNAME = () =>
  JSON.parse(sessionStorage.getItem('user'))?.name || null;
export const getSSEMAIL = () =>
  JSON.parse(sessionStorage.getItem('user'))?.email || null;
export async function getAPIData(apiURL, method = 'GET', data) {
  let apiData;

  try {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    if (data) {
      headers.append('Content-Length', String(JSON.stringify(data).length));
    }
    apiData = await simpleFetch(apiURL, {
      signal: AbortSignal.timeout(TIMEOUT),
      method: method,
      body: data ?? undefined,
      headers: headers,
    });
  } catch (/** @type {any | HttpError} */ err) {
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
  console.log(apiData, typeof apiData, 'data from getApiData');
  return apiData;
}

export function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */ (inputElement).value;
  } else {
    return '';
  }
}

export function launchpreCartPoPup(ing) {
  console.log('buy ingredient function activated by the click', ing);

  window.dispatchEvent(
    new CustomEvent('ingredient-selected', {
      detail: ing,
      bubbles: true,
      composed: true,
    })
  );
}

export function ConfirmAddedToCart() {
  window.dispatchEvent(
    new CustomEvent('AddedToCart', {
      bubbles: true,
      composed: true,
    })
  );
}

export async function checkLoggedIn() {
  console.log('CHECK LOGIN EXECUTED', location.pathname);
  const restrictedPages = [
    '/cart.html',
    '/shop.html',
    '/chooserecipe.html',
    '/calculator.html',
    '/user.html',
  ];
  const accessPages = ['/', '/index.html', '/sign.html', '/login.html'];

  const session = await getSessionWithFallback();
  console.log('SESSION:', session);
  if (restrictedPages.includes(location.pathname) && !session) {
    location.href = './index.html';
    return;
  }

  if (accessPages.includes(location.pathname) && session) {
    location.href = './user.html';
  }
}

async function getSessionWithFallback() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) return session;
  return new Promise((resolve) => {
    const TIMEOUT_MS = 5000;

    const timer = setTimeout(() => {
      subscription.unsubscribe();
      resolve(null);
    }, TIMEOUT_MS);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        clearTimeout(timer);
        subscription.unsubscribe();
        resolve(session);
      }
    });
  });
}
export async function syncUserWithMongo() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new Promise((resolve) => {
      const TIMEOUT_MS = 5000;

      const timer = setTimeout(() => {
        subscription.unsubscribe();
        resolve(null);
      }, TIMEOUT_MS);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          clearTimeout(timer);
          subscription.unsubscribe();

          if (session) {
            resolve(await _doSync(session));
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  return await _doSync(session);
}

async function _doSync(session) {
  const response = await fetch(`${API_URL}/api/users/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'User synchronization failed');
  }

  sessionStorage.setItem('user', JSON.stringify(data));

  return data;
}

export function formatPrice(price) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}
