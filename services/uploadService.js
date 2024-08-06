const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines with actual newlines
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});

const bucket = admin.storage().bucket();

const uploadToFirebase = async (buffer, fileName) => {
  const file = bucket.file(fileName);
  await file.save(buffer, {
    metadata: { contentType: 'image/jpg' }, // Adjust the content type as needed
    public: true // Makes the file publicly accessible
  });
  return file.publicUrl();
};

module.exports =  uploadToFirebase;