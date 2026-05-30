const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if(parts.length >= 2) acc[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  return acc;
}, {});
const { initializeApp } = require('firebase/app');
const { getFirestore, getCountFromServer, collection, getDocs } = require('firebase/firestore');

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});
const db = getFirestore(app);

async function run() {
  try {
    const snap = await getCountFromServer(collection(db, 'builder_profiles'));
    console.log('COUNT:', snap.data().count);
  } catch (e) {
    console.error('COUNT ERROR:', e.message);
  }
  
  try {
    const docs = await getDocs(collection(db, 'builder_profiles'));
    console.log('DOCS LENGTH:', docs.docs.length);
  } catch (e) {
    console.error('DOCS ERROR:', e.message);
  }
}
run();
