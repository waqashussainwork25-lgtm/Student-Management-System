import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAaNU0EorIPc5iCyTAbd_65fAhC01G9ahs",
  authDomain: "student-management-syste-222de.firebaseapp.com",
  projectId: "student-management-syste-222de",
  storageBucket: "student-management-syste-222de.appspot.com",
  messagingSenderId: "37482486719",
  appId: "1:37482486719:web:053da44d1aca0a9ba59f0a",
  measurementId: "G-4PKW0LC26G",
};




const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);