// src/scripts/initializeFirebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { initialProjects, initialBoards, initialColumns, initialTasks, dummyMembers, dummyLabels } from '../initialData.js';

const firebaseConfig = {
    apiKey: "AIzaSyBNuKT_D9NMlIzmE2sNfLI5-0JwHsRBPco",
    authDomain: "teamlist-a2f1c.firebaseapp.com",
    projectId: "teamlist-a2f1c",
    storageBucket: "teamlist-a2f1c.appspot.com",
    messagingSenderId: "401780644077",
    appId: "1:401780644077:web:0274114fb7b282ed5e94e4"
};

console.log('Firebase Config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearFirestoreData() {
  const collections = ['members', 'labels', 'projects', 'boards', 'columns', 'tasks'];
  for (const collectionName of collections) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }
  console.log('Firestore data cleared successfully');
}

async function addDocument(collectionPath, data, docId = null) {
  console.log(`Attempting to add document to ${collectionPath}:`);
  console.log(JSON.stringify(data, null, 2));
  try {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    let docRef;
    if (docId) {
      docRef = doc(db, collectionPath, docId);
      await setDoc(docRef, cleanData);
    } else {
      docRef = await addDoc(collection(db, collectionPath), cleanData);
    }
    console.log(`Document ${docId ? 'set' : 'added'} successfully to ${collectionPath} with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`ERROR ${docId ? 'setting' : 'adding'} document to ${collectionPath}:`, error.message);
    return null;
  }
}

async function initializeFirebase() {
  try {
    console.log('Starting Firebase initialization...');

    // Clear existing data
    await clearFirestoreData();

    // Add members
    for (const member of dummyMembers) {
      const { password, ...memberData } = member;
      await addDocument('members', memberData, member.id);
    }

    // Add labels
    for (const label of dummyLabels) {
      await addDocument('labels', label, label.id);
    }

    // Add projects
    for (const project of initialProjects) {
      await addDocument('projects', project, project.id);
    }

    // Add boards
    for (const board of initialBoards) {
      await addDocument('boards', board, board.id);
    }

    // Add columns
    for (const column of initialColumns) {
      await addDocument('columns', column, column.id);
    }

    // Add tasks
    for (const task of initialTasks) {
      await addDocument('tasks', task, task.id);
    }

    console.log('Firebase initialization completed successfully');
  } catch (error) {
    console.error('FATAL ERROR in initializeFirebase:', error.message);
  }
}

initializeFirebase().then(() => {
  console.log('Script execution completed');
  process.exit();
}).catch(error => {
  console.error('Unhandled error in script execution:', error.message);
  process.exit(1);
});