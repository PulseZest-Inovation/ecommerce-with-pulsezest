import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { EmailType } from "@/types/EmailType";

// Define the expected structure of the Firestore document

export const fetchEmailDetails = async (): Promise<EmailType | null> => {
  try {
    // Fetch the document data
    const data = await getDataByDocName<EmailType>("settings", "email-setting");

    if (!data) {
      console.warn("No data found for email settings.");
      return null; // Return `null` if no data is found
    }

    return data; // Return the entire object as is
  } catch (error) {
    console.error("Error fetching email settings:", error);
    return null; // Return `null` in case of an error
  }
};
