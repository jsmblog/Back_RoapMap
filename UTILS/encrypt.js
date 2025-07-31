import CryptoJS from "crypto-js";
import { SECRET_KEY } from '../FIREBASE_ENV/env.js';
export const encrypt=t=>CryptoJS.AES.encrypt(t,SECRET_KEY).toString();