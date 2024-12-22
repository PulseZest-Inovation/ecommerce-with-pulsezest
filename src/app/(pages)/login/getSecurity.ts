import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../utils/firbeaseConfig";
/**
 * Validates the security key by checking its existence as a document ID in the `securityCheck` collection.
 * 
 * @param securityKey - The security key to validate.
 * @returns A promise that resolves to `true` if the document exists, otherwise `false`.
 */
const getSecurityCheck = async (securityKey: string): Promise<boolean> => {
  try {
    // Reference the document using the security key as the document ID
    const docRef = doc(db, "app_name", securityKey);

    // Fetch the document
    const docSnap = await getDoc(docRef);
    console.log(docSnap.exists());
    // Check if the document exists
    return docSnap.exists();
  } catch (error) {
    console.error("Error fetching security key:", error);
    return false; // Treat any error as invalid key
  }
};

export default getSecurityCheck;
