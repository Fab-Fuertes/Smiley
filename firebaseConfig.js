var admin = require("firebase-admin");
require("dotenv").config();


// Fetch the service account key JSON file contents
var serviceAccount = {
  type: process.env.REACT_APP_TYPE,
  project_id: process.env.REACT_APP_PROJECT_ID,
  private_key_id: process.env.REACT_APP_PRIVATE_KEY_ID,
  private_key: process.env.REACT_APP_PRIVATE_KEY.replace(/\\n/g, "\n"), // Asegúrate de reemplazar los saltos de línea en el `private_key`
  client_email: process.env.REACT_APP_CLIENT_EMAIL,
  client_id: process.env.REACT_APP_CLIENT_ID,
  auth_uri: process.env.REACT_APP_AUTH_URI,
  token_uri: process.env.REACT_APP_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.REACT_APP_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.REACT_APP_CLIENT_X509_CERT_URL,
};

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: process.env.REACT_APP_DATABASE_URL,
});

// Exporta la referencia de la base de datos
var db = admin.database();
module.exports = db;

