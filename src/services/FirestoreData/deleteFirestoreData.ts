// deleteFirestoreData.ts
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/utils/firbeaseConfig';

const appKey = typeof window !== "undefined" ? localStorage.getItem("securityKey") : null;

/**
 * Deletes a document from a specified collection.
 * @param collectionName - The name of the Firestore collection.
 * @param docName - The ID of the document to delete.
 * @returns A boolean indicating success or failure.
 */
export const deleteDocFromCollection = async (collectionName: string, docName: string): Promise<boolean> => {
  try {
    if (!appKey) {
      throw new Error('No security key found in localStorage!');
    }

    // Reference to the document
    const docRef = doc(db, 'app_name', appKey, collectionName, docName);

    // Delete the document
    await deleteDoc(docRef);
    console.log(`Document with ID '${docName}' successfully deleted from '${collectionName}'.`);
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};
