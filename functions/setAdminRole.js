const admin = require('firebase-admin');

// IMPORTANT: This path is relative to where you run the script from.
// If you run `node functions/setAdminRole.js` from the project root,
// this path needs to be './functions/serviceAccountKey.json'
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get the email from the command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Error: Please provide a user email as an argument.');
  process.exit(1);
}

async function setAdminRole(email) {
  try {
    // 1. Find the user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    // 2. Set the custom claim
    // This will overwrite any existing claims.
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });

    console.log(`Successfully set user ${email} (UID: ${uid}) as an admin.`);
    console.log('They will have admin privileges on their next login.');

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`Error: User with email ${email} not found.`);
    } else {
      console.error('Error setting custom claims:', error);
    }
  }
}

setAdminRole(email); 