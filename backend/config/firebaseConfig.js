const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "inapply-9f3b6.firebasestorage.app",
});

const bucket = admin.storage().bucket();

// logging the actual bucket name
console.log("Firebase Storage Bucket:", bucket.name);

module.exports = { bucket };
