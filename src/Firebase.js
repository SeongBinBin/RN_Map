import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSdRWgA9BR6-ZYrXBW8Ge1fhYtMb1_d4o",
    authDomain: "travelmaker-be769.firebaseapp.com",
    databaseURL: "https://travelmaker-be769-default-rtdb.firebaseio.com",
    projectId: "travelmaker-be769",
    storageBucket: "travelmaker-be769.appspot.com",
    messagingSenderId: "955285310382",
    appId: "1:955285310382:web:86cc565e2cf27678b6163f"
};

const firebase = initializeApp(firebaseConfig);

const fireStore = getFirestore(firebase);

export { fireStore };