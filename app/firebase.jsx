import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDdYDwthlPPjHv66W_Hl9oRAuYTXXiTSmM",
  authDomain: "kds-remix.firebaseapp.com",
  projectId: "kds-remix",
  storageBucket: "kds-remix.appspot.com",
  messagingSenderId: "38823345299",
  appId: "1:38823345299:web:0ccdcef41485fa6660a166"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
