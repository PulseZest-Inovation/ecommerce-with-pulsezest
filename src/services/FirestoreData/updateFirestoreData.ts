import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firbeaseConfig';
const appKey = typeof window !== "undefined" ? localStorage.getItem("securityKey") : null;

/**
 * Update document in Firestore with a custom ID.
 * 
 * @param collectionName - The collection name where the document exists.
 * @param docId - The custom ID of the document to be updated.
 * @param updatedData - The updated data for the document.
 * 
 * @returns A promise indicating whether the update was successful.
 */
export const updateDocWithCustomId = async (
  collectionName: string,
  docId: string,
  updatedData: Record<string, any>
): Promise<boolean> => {
  try {
    if (!appKey) {
        throw new Error('No security key found in localStorage!');
      }
    const docRef = doc(db,'app_name',appKey, collectionName, docId); // Reference to the document with the custom ID
    await updateDoc(docRef, updatedData); // Update the document with the new data
    return true; // Return true if the update was successful
  } catch (error) {
    console.error('Error updating document: ', error); // Handle errors
    return false; // Return false if an error occurred
  }
};
