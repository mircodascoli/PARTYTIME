
import { simpleFetch } from './lib/simpleFetch.js';
import { HttpError } from './clases/HttpError.js';
import { supabase } from '../config/supabaseClient.js';

const TIMEOUT = 10000;
const AUTH_TIMEOUT = 5000;

export const API_URL =
  location.hostname === 'localhost' ||
  location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:1337'
    : 'https://partytime-5tie.onrender.com';

// ---------- USER PROFILE ----------

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('user')) || null;
  } catch {
    return null;
  }
}

export const getSSID = () => getStoredUser()?._id || null;

export const getSSNAME = () => getStoredUser()?.name || null;

export const getSSEMAIL = () => getStoredUser()?.email || null;

// ---------- API REQUESTS ----------

export async function getAPIData(apiURL, method = 'GET', data) {
  let apiData;

  try {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    if (data) {
      headers.append(
        'Content-Length',
        String(JSON.stringify(data).length)
      );
    }

    apiData = await simpleFetch(apiURL, {
      signal: AbortSignal.timeout(TIMEOUT),
      method,
      body: data ?? undefined,
      headers,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('Fetch aborted');
    }

    if (err instanceof HttpError) {
      if (err.response.status === 404) {
        console.error('Not found');
      }

      if (err.response.status === 500) {
        console.error('Internal server error');
      }
    }

    console.error('API request failed:', err);
  }

  console.log(apiData, typeof apiData, 'data from getAPIData');

  return apiData;
}

// ---------- INPUTS ----------

export function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */ (inputElement).value;
  }

  return '';
}

// ---------- CART EVENTS ----------

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

// ---------- AUTHENTICATION ----------

export async function checkLoggedIn() {
  console.log('CHECK LOGIN EXECUTED', location.pathname);

  const restrictedPages = [
    '/cart.html',
    '/shop.html',
    '/chooserecipe.html',
    '/calculator.html',
    '/user.html',
  ];

  const accessPages = [
    '/',
    '/index.html',
    '/sign.html',
    '/login.html',
  ];

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

// ---------- SUPABASE SESSION ----------

async function getSessionWithFallback() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error retrieving Supabase session:', error);
    return null;
  }

  if (session) {
    return session;
  }

  return new Promise((resolve) => {
    let subscription;
    let resolved = false;

    const timer = setTimeout(() => {
      if (resolved) return;

      resolved = true;
      subscription?.unsubscribe();
      resolve(null);
    }, AUTH_TIMEOUT);

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN'
      ) {
        if (resolved) return;

        resolved = true;
        clearTimeout(timer);
        subscription?.unsubscribe();

        resolve(newSession);
      }
    });

    subscription = authSubscription;
  });
}

// ---------- MONGODB USER SYNC ----------

export async function syncUserWithMongo() {
  const session = await getSessionWithFallback();

  if (!session) {
    return null;
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
    throw new Error(
      data.error || 'User synchronization failed'
    );
  }

  const userProfile = {
    ...data,
    email: session.user.email,
    name:
      data.name ||
      session.user.user_metadata?.full_name ||
      session.user.user_metadata?.name ||
      session.user.email?.split('@')[0],
    supabaseId: session.user.id,
  };

  sessionStorage.setItem(
    'user',
    JSON.stringify(userProfile)
  );

  return userProfile;
}

// ---------- PRICE FORMAT ----------

export function formatPrice(price) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}
