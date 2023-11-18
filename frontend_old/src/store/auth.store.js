import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SERVER_URL } from '../app/utils/constants';

export async function authenticateUser(email, password) {
  try {
    const response = await fetch(`${SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Here we assume the response is JSON and parse it
    return await response.json(); // This is the body of the response
  } catch (error) {
    console.error('There was an error!', error);
    throw error; // Rethrow the error for the caller to handle
  }
}

const authStore = (set) => ({
  jwtToken: null,
  role: null,
  setJWTToken: (token) => set({ jwtToken: token }),
  setRole: (role) => set({ role: role }),
});
//remove it.
const useAuthStore = create(
  devtools(
    persist(authStore, {
      name: 'Authentication',
    }),
  ),
);

export default useAuthStore;
