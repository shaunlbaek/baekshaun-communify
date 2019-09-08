import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

let config = {
  apiKey: "AIzaSyAAhEr7ofTPAFcBaLmdD73pcCtNVfcgfXs",
  authDomain: "schoolcommunity-115a3.firebaseapp.com",
  databaseURL: "https://schoolcommunity-115a3.firebaseio.com",
  projectId: "schoolcommunity-115a3",
  storageBucket: "schoolcommunity-115a3.appspot.com"
};
firebase.initializeApp(config);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, firebase, storage };
