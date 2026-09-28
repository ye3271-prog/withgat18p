import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  deleteDoc,
  collection, 
  onSnapshot, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GroupProgress } from '../types';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Validate connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is currently offline or unreachable.");
    }
  }
}
testConnection();

// Real-time listener for all groups across devices
export function subscribeToAllGroups(onUpdate: (groups: Record<string, GroupProgress>) => void) {
  const colRef = collection(db, 'groups');
  return onSnapshot(colRef, (snapshot) => {
    const data: Record<string, GroupProgress> = {};
    snapshot.forEach((docSnap) => {
      const val = docSnap.data() as GroupProgress;
      if (val && val.groupName) {
        data[val.groupName] = val;
      }
    });
    onUpdate(data);
  }, (err) => {
    console.warn("Firestore sync subscription warning:", err);
  });
}

// Save progress to cloud
export async function saveGroupProgressToCloud(progress: GroupProgress) {
  try {
    const docRef = doc(db, 'groups', progress.groupName);
    await setDoc(docRef, {
      ...progress,
      lastUpdated: Date.now(),
    }, { merge: true });
  } catch (err) {
    console.error("Failed to save group to cloud:", err);
  }
}

// Reset specific group in cloud
export async function resetGroupInCloud(groupName: string) {
  try {
    const docRef = doc(db, 'groups', groupName);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Failed to reset group in cloud:", err);
  }
}

// Reset all groups in cloud
export async function resetAllGroupsInCloud(groupNames: string[]) {
  try {
    await Promise.all(
      groupNames.map((name) => deleteDoc(doc(db, 'groups', name)))
    );
  } catch (err) {
    console.error("Failed to reset all groups in cloud:", err);
  }
}
