import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Replace this with your own config details
var config = {
  apiKey: "AIzaSyDoeoK4uWp3oz-srBEuB5kLFSWK9A33CW4",
  authDomain: "staffa-13e8a.firebaseapp.com",
  databaseURL: "https://staffa-13e8a.firebaseio.com",
  projectId: "staffa-13e8a",
  storageBucket: "staffa-13e8a.appspot.com",
  messagingSenderId: "1007743977250",
  appId: "1:1007743977250:web:e8986738d43945dcbf877b",
  measurementId: "G-71XLCEGF8M"
};
firebase.initializeApp(config);

export default firebase;
