import Strings from '../../utilities/Strings'
import firebase from "firebase/app";

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
const firebaseApp = firebase.initializeApp(config, "message");

export const getUserConversationNodeForChat = (userID) => {
  var users = firebaseApp
      .firestore()
      .collection(Strings.FS_COLLECTION_USER_CONVERSATION);
    return users.doc(userID).collection(Strings.FS_COLLECTION_CONVERSATION);
}

export const isUserConversationExist = (userID, callBack) => {
  var users = firebaseApp
      .firestore()
      .collection(Strings.FS_COLLECTION_USER_CONVERSATION);
    var coversation = users.doc(userID);
    coversation.get().then(doc => {
      callBack(doc.exists);
    });
}

export const getUserData = (userID, callBack) => {
  var users = firebaseApp.firestore().collection(Strings.FS_COLLECTION_USERS);
  var userDoc = users.doc(userID);
  userDoc
    .get()
    .then(doc => {
      callBack(false, doc.data());
    })
    .catch(err => {
      callBack(true, null);
    });
}

export const getConversationMessagesNode = (chatUID) => {
  var chatRef = firebaseApp
    .firestore()
    .collection(Strings.FS_COLLECTION_CONVERSATION)
    .doc(chatUID);
  return chatRef.collection(Strings.FS_COLLECTION_MESSAGES);
}

