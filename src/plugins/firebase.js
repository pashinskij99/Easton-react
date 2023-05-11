// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import { setAccessToken, setUserId } from "../utils/cookie";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVVJWCyFYyqyAtILdgLtUnpqXLjvm_Sjc",
  authDomain: "easton-webapp-login.firebaseapp.com",
  projectId: "easton-webapp-login",
  storageBucket: "easton-webapp-login.appspot.com",
  messagingSenderId: "340278941165",
  appId: "1:340278941165:web:7e96560b946c3cc628c3e4",
  measurementId: "G-5NE3JY5J9E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = await signInWithEmailAndPassword(auth, email, password);
      const token = await auth.currentUser.getIdToken();

      const docRef = doc(db, "users", userInfo.user.uid);
      const userSnapshot = await getDoc(docRef);
      const userData = userSnapshot.data();

      setAccessToken(token);
      setUserId(userInfo.user.uid);
      if (userData) {
        resolve({
          success: true,
          user: userData,
        });
      } else {
        resolve({
          success: false,
          err: { message: "User does not exist." },
        });
      }
    } catch (err) {
      resolve({
        success: false,
        code: err?.code,
        err,
      });
    }
  });
};

const registerWithEmailAndPassword = async (name, email, password, role) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        name,
        email,
        role,
        id: user.uid,
      });

      const token = await auth.currentUser.getIdToken();

      const currentUserRef = doc(db, "users", user.uid);
      const currentUserSnapshot = await getDoc(currentUserRef);
      const userData = currentUserSnapshot.data();

      setAccessToken(token);
      setUserId(user.uid);

      resolve({
        success: true,
        user: userData,
      });
    } catch (err) {
      resolve({
        success: false,
        code: err?.code,
        err,
      });
    }
  });
};

const getCurrentUserInfo = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentUserRef = doc(db, "users", userId);
      const currentUserSnapshot = await getDoc(currentUserRef);
      const userData = currentUserSnapshot.data();

      resolve({
        success: true,
        user: userData,
      });
    } catch (err) {
      resolve({
        success: false,
        code: err?.code,
        err,
      });
    }
  });
};

export {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  getCurrentUserInfo,
};
