import { getAppDoc } from "./FirestoreData/getFirestoreData";
import { message } from "antd";

export const verifySecurityKey = async (key: string): Promise<boolean> => {
  try {

     // Ensure the code is running in the browser
     if (typeof window === "undefined") {
      throw new Error('localStorage is not available on the server!');
    }

    const result = await getAppDoc<{ key: string }>('app_name', key);
    if (result) {
      localStorage.setItem('securityKey', key);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error verifying security key:", error);
    message.error("An error occurred while verifying the key. Please try again.");
    return false; 
  }
};
