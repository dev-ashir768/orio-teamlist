// src/services/firebaseDataService.js

import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNuKT_D9NMlIzmE2sNfLI5-0JwHsRBPco",
    authDomain: "teamlist-a2f1c.firebaseapp.com",
    projectId: "teamlist-a2f1c",
    storageBucket: "teamlist-a2f1c.appspot.com",
    messagingSenderId: "401780644077",
    appId: "1:401780644077:web:0274114fb7b282ed5e94e4",
    measurementId: "G-C9CJ1JTDYQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export const firebaseDataService = {
  // Projects
  getProjects: async () => {
    const projectsRef = collection(db, 'projects');
    const querySnapshot = await getDocs(projectsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  addProject: async (project) => {
    const docRef = doc(collection(db, 'projects'));
    await setDoc(docRef, project);
    return { id: docRef.id, ...project };
  },
  
  updateProject: async (projectId, projectData) => {
    const docRef = doc(db, 'projects', projectId);
    await updateDoc(docRef, projectData);
  },
  
  deleteProject: async (projectId) => {
    await deleteDoc(doc(db, 'projects', projectId));
  },

  // Boards
  getBoards: async (projectId) => {
    const boardsRef = collection(db, 'projects', projectId, 'boards');
    const querySnapshot = await getDocs(boardsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  addBoard: async (projectId, board) => {
    const docRef = doc(collection(db, 'projects', projectId, 'boards'));
    await setDoc(docRef, board);
    return { id: docRef.id, ...board };
  },
  
  updateBoard: async (projectId, boardId, boardData) => {
    const docRef = doc(db, 'projects', projectId, 'boards', boardId);
    await updateDoc(docRef, boardData);
  },
  
  deleteBoard: async (projectId, boardId) => {
    await deleteDoc(doc(db, 'projects', projectId, 'boards', boardId));
  },

  // Members
  getMembers: async () => {
    const membersRef = collection(db, 'members');
    const querySnapshot = await getDocs(membersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addMember: async (member) => {
    const docRef = doc(collection(db, 'members'));
    await setDoc(docRef, member);
    return { id: docRef.id, ...member };
  },

  // Labels
  getLabels: async () => {
    const labelsRef = collection(db, 'labels');
    const querySnapshot = await getDocs(labelsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addLabel: async (label) => {
    const docRef = doc(collection(db, 'labels'));
    await setDoc(docRef, label);
    return { id: docRef.id, ...label };
  },
};