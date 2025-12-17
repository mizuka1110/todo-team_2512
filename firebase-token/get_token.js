import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAV_IHvS3xSCGLxsVWowWMOusx8ZQ-Sm9E",
  authDomain: "todo-654d9.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "admin@test.com";
const password = "admin123";

await signInWithEmailAndPassword(auth, email, password);
const token = await auth.currentUser.getIdToken();

console.log(token);
