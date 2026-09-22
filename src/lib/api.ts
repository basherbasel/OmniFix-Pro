import { auth } from './firebase';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Authentication required');
  }

  const idToken = await user.getIdToken();

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
    'x-fb-id-token': idToken, // Double layer
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
