// getFirestoreData.ts
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firbeaseConfig";

/**
 * Get all documents from a collection.
 * @param collectionName - Name of the collection.
 * @returns A promise resolving to an array of documents.
 */
export const getAllDocsFromCollection = async <T>(
  collectionName: string
): Promise<Array<T & { id: string }>> => {
  try {
    const colRef = collection(db, collectionName);
    const querySnapshot = await getDocs(colRef);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));
    return data;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

/**
 * Get a specific document from a collection by document name.
 * @param collectionName - Name of the collection.
 * @param docName - Name of the document.
 * @returns A promise resolving to the document data.
 */
export const getDocByDocName = async <T>(
  collectionName: string,
  docName: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as T;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};
