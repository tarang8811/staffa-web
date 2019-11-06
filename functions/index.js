const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const createNotification = notification => {
  console.log(notification);
  return admin
    .firestore()
    .collection("notifications")
    .add(notification)
    .then(doc => console.log("notification added", doc));
};

module.exports = {
  ...require("./updateContract/ContractUpdate"),
  ...require("./chatMessages/ChatMessageReceived"),
  ...require("./payments/stripeApis")
};

exports.projectCreated = functions.firestore
  .document("projects/{projectId}")
  .onCreate(doc => {
    const project = doc.data();
    const notification = {
      content: "Added a new Shift",
      user: `${project.authorFirstName} ${project.authorLastName}`,
      time: admin.firestore.FieldValue.serverTimestamp()
    };

    return createNotification(notification);
  });

exports.userJoined = functions.auth.user().onCreate(user => {
  console.log(user);
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then(doc => {
      const newUser = doc.data();
      const notification = {
        content: "Joined the Staffa",
        user: `${newUser.firstName} ${newUser.lastName}`,
        time: admin.firestore.FieldValue.serverTimestamp()
      };

      if (newUser.isAdmin === "true") {
        console.log(newUser);
        addAdminRole(user.email);
      }

      return createNotification(notification);
    });
});
const addAdminRole = data => {
  console.log(data);
  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin.`
      };
    })
    .catch(err => {
      return err;
    });
};
