import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCaxf71hd5-0fzQ1l098hu3ynEyMs5r5t4",
  authDomain: "inapply-9f3b6.firebaseapp.com",
  projectId: "inapply-9f3b6",
  storageBucket: "inapply-9f3b6.firebasestorage.app",
  messagingSenderId: "336779002883",
  appId: "1:336779002883:web:010fa075f1f53c1816fa36",
  measurementId: "G-SN3W3PPWT4"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
