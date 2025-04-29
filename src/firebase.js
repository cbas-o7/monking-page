import dotenv from 'dotenv';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

dotenv.config()

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

//console.log(process.env) // remove this after you've confirmed it is working

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore("monking-db");

export const getData = async () => {
    try {
        const designsRef = collection(db, "designs");
        const q = query(designsRef, orderBy("code", "asc"));
        const querySnapshot = await getDocs(q);
        const designs = [];
        
        querySnapshot.forEach((doc) => {
            designs.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return designs;
    } catch (error) {
        console.error("Error getting documents:", error);
        return [];
    }
}