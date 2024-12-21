// setFirestoreData.ts
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firbeaseConfig";

/**
 * Set data with a specific collection and document name.
 * @param collectionName - Name of the collection.
 * @param docName - Name of the document.
 * @param data - Data to store.
 */
export const setDataWithDocName = async <T>(
  collectionName: string,
  docName: string,
  data: any
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docName);
    await setDoc(docRef, data);
    console.log("Document successfully written!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};

/**
 * Add data to a collection with an auto-generated document ID.
 * @param collectionName - Name of the collection.
 * @param data - Data to store.
 * @returns The document ID of the newly added document.
 */
export const setDataWithAutoID = async <T>(
  collectionName: string,
  data: any
): Promise<string | null> => {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};



// import { addDocToCollection } from "./setFirestoreData";
// import { Customer } from "./types"; // Import Customer type

// const addCustomer = async () => {
//   const newCustomer: Customer = {
//     firstName: "John",
//     lastName: "Doe",
//     phone: "1234567890",
//     address: "123 Main St",
//   };

//   const docId = await addDocToCollection("customers", newCustomer);
//   console.log("Customer added with ID:", docId);
// };
