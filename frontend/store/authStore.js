import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SERVER_URL } from '../src/constants';
import AES from 'crypto-js/aes';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import CryptoJS from 'crypto-js';

function encryptData(data, key) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  const ciphertext = AES.encrypt(data, keyBytes, { iv }).toString();
  const ivString = CryptoJS.enc.Hex.stringify(iv);

  const mac = HmacSHA256(ciphertext + ivString, key).toString();

  return { ciphertext, iv: ivString, mac };
}

function decryptData({ ciphertext, iv, mac }, key) {
  const hmac = CryptoJS.HmacSHA256(ciphertext + iv, key).toString();
  if (hmac !== mac) {
    throw new Error('MAC verification failed');
  } else {
    console.log('### Mac verified');
  }

  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const ivWordArray = CryptoJS.enc.Hex.parse(iv);

  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

  return JSON.parse(decryptedText);
}

export async function authenticateUser(email, password) {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('Encryption key is not set');
  }
  console.log(
    '### data sent to backend',
    JSON.stringify({
      email,
      password,
    }),
  );
  const { ciphertext, iv, mac } = encryptData(
    JSON.stringify({
      email,
      password,
    }),
    key,
  );

  const sendData = JSON.stringify({ ciphertext, iv, mac });
  try {
    const response = await fetch(`${SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: sendData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const res = decryptData(data, key);

    console.log('######', res);
    return res;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
}

const authStore = (set) => ({
  jwtToken: null,
  role: null,
  email: null,
  setJWTToken: (token) => set({ jwtToken: token }),
  setRole: (role) => set({ role: role }),
  setEmail: (email) => set({ email: email }),
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
