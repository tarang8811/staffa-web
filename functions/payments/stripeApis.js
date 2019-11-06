const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_qnWHaI8DUOaDcUdNDNoccnZZ00tjXgzQ9D');

const FS_COLLECTION_USERS = "Users";

// when user is created register them with stripe
exports.createStripeCustomer = functions.auth.user().onCreate((event) => {
  const data = event.data;
  return stripe.customers.create({
    email: data.email,
  }).then((customer) => {
    admin.firestore().collection(FS_COLLECTION_USERS)
      .doc(userID)
      .update({stripe_id: customer.id});
  });
});
