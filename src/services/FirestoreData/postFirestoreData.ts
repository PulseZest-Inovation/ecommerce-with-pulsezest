import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firbeaseConfig';
const appKey = typeof window !== "undefined" ? localStorage.getItem("securityKey") : null;
/**
 * Creates a document with an auto-generated ID in the default collection and sets the provided data.
 * @param data - The data to be stored in the document.
 * @param subCollectionName - Optional sub-collection name under the default collection.
 * @returns The document ID of the created document.
 */
/**
 * Creates a document with an auto-generated ID in the specified collection and sets the provided data.
 * @param collectionName - The name of the Firestore collection.
 * @param data - The data to be stored in the document.
 * @returns The document ID of the created document.
 */
export const createDocWithAutoId = async (
    collectionName: string,
    data: Record<string, any>
  ): Promise<string | null> => {
    try {
      if (!appKey) {
        throw new Error('No security key found in localStorage!');
      }
  
      // Reference to the specified collection
      const colRef = collection(db, 'app_name', appKey, collectionName);
  
      // Add the document with an auto-generated ID
      const docRef = await addDoc(colRef, data);
      console.log(`Document created with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error creating document with auto ID:', error);
      return null;
    }
  };


/**
 * Sets data to a document with a custom ID in the specified collection.
 * @param collectionName - The name of the Firestore collection.
 * @param docName - The custom document ID.
 * @param data - The data to be stored in the document.
 * @returns A boolean indicating success or failure.
 */
export const setDocWithCustomId = async <T>(
  collectionName: string,
  docName: string,
  data: Record<string, any>
): Promise<boolean> => {
  try {
    if (!appKey) {
      throw new Error('No security key found in localStorage!');
    }

    // Reference to the document
    const docRef = doc(db, 'app_name', appKey, collectionName, docName);

    // Set the data to the document with merge option
    await setDoc(docRef, data, { merge: true }); // Use merge: true to avoid overwriting the document
    console.log(`Document with ID '${docName}' successfully written in '${collectionName}'.`);
    return true;
  } catch (error) {
    console.error('Error setting document with custom ID:', error);
    return false;
  }
};