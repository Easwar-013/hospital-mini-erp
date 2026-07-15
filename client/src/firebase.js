import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUpKcEv9eOXb4Mf0uokHTrM0332tDd6S4",
  authDomain: "hospital-mini-erp.firebaseapp.com",
  projectId: "hospital-mini-erp",
  storageBucket: "hospital-mini-erp.firebasestorage.app",
  messagingSenderId: "903012718259",
  appId: "1:903012718259:web:18faad08c1d5b7581602c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// This allows us to set up the invisible captcha for Phone OTP later
export const setupRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
    });
  }
  return window.recaptchaVerifier;
};