import CryptoJS from"crypto-js";
import { SECRET_KEY } from "../FIREBASE_ENV/env.js";
export const decrypt = t => {
    try {
        const r = CryptoJS.AES.decrypt(t, SECRET_KEY);
        return r.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Error en decrypt:", error);
        throw error; 
    }
};