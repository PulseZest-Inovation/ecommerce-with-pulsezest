import { doc, getDoc, } from "firebase/firestore";
import { db } from "@/utils/firbeaseConfig";


export const getAppData = async <T>(
    collectionName: string,
    docName: string
  ): Promise<T | null> => {
    try {


       // Ensure the code is running in the browser
    if (typeof window === "undefined") {
      throw new Error('localStorage is not available on the server!');
    }
    
      // Retrieve the appKey from localStorage
      const appKey = localStorage.getItem('securityKey');
      if (!appKey) {
        throw new Error('No security key found in localStorage!');
      }
  
      // Reference the document in Firestore
      const docRef = doc(db, collectionName, docName);
      const docSnap = await getDoc(docRef);
  
      // Check if the document exists
      if (docSnap.exists()) {
        return docSnap.data() as T;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document: ', error);
      return null;
    }
  };