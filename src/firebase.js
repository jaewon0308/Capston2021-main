import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAHNdP1T-NlsIqyUDodYUcZnt8HZMUdj80",
    authDomain: "project-6629124072636312930.firebaseapp.com",
    projectId: "project-6629124072636312930",
    storageBucket: "project-6629124072636312930.appspot.com",
    messagingSenderId: "560218264203",
    appId: "1:560218264203:web:4e3e37dfcd34e2e66cba8e",
    measurementId: "G-K5JTY06QD9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics(); //통계 부분


  export default firebase;