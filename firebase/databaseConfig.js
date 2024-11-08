const admin = require("firebase-admin");
require("dotenv").config();

// Fetch the service account key JSON file contents
const serviceAccount = {
  type: process.env.REACT_APP_TYPE,
  project_id: process.env.REACT_APP_PROJECT_ID,
  private_key_id: process.env.REACT_APP_PRIVATE_KEY_ID,
  private_key: process.env.REACT_APP_PRIVATE_KEY.replace(/\\n/g, "\n"), // Asegurate de reemplazar los saltos de línea en el `private_key`
  client_email: process.env.REACT_APP_CLIENT_EMAIL,
  client_id: process.env.REACT_APP_CLIENT_ID,
  auth_uri: process.env.REACT_APP_AUTH_URI,
  token_uri: process.env.REACT_APP_TOKEN_URI,
  auth_provider_x509_cert_url:
  process.env.REACT_APP_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.REACT_APP_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.REACT_APP_DATABASE_URL
});

const auth = admin.auth();
const database = admin.firestore();
const messaging = admin.messaging();
const realtimeDB = admin.database();

module.exports = { auth, database, realtimeDB, messaging, admin };
