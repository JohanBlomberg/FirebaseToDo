import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyBwB3rYtXn_JitZW7_--_9DHQVv_oarHwE",
      authDomain: "paybills-d9eba.firebaseapp.com",
      projectId: "paybills-d9eba",
      storageBucket: "paybills-d9eba.appspot.com",
      messagingSenderId: "195348038043",
      appId: "1:195348038043:web:84d318d024bd5088f3213e"

  };

const app = initializeApp(firebaseConfig)


const auth = getAuth(app);
const db = getFirestore(app)

  export { auth, db }