"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAV_IHvS3xSCGLxsVWowWMOusx8ZQ-Sm9E",
  authDomain: "todo-654d9.firebaseapp.com",
  projectId: "todo-654d9",
  storageBucket: "todo-654d9.firebasestorage.app",
  messagingSenderId: "132179774078",
  appId: "1:132179774078:web:3764d3b272dfb37a48662f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);