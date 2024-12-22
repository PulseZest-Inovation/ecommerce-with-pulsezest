import { getDocByDocName } from "./getFirestoreData";
import { message } from "antd";

export const verifySecurityKey = async (key: string): Promise<boolean> => {
  try {
    const result = await getDocByDocName<{ key: string }>('app_name', key);
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
