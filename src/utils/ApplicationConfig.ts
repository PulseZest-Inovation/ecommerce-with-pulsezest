import { signOut } from "firebase/auth";
import { auth } from "./firbeaseConfig";
import { getAppData } from "@/services/getApp";
import { AppDataType } from "@/types/AppData";

// Function to get the security key from localStorage
const getSecurityKey = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("securityKey");
  }
  return null; // Default value for server-side
};

// Fetch the security key and handle sign out if it's missing
const key = getSecurityKey();
if (!key) {
  if (typeof window !== "undefined") {
    console.warn("Security key not found. Signing out...");
    signOut(auth)
      .then(() => console.log("Successfully signed out"))
      .catch((error) => console.error("Error during sign-out:", error));
  }
}

// Declare the ApplicationConfig object with default values
export let ApplicationConfig: AppDataType | null = null;

// Fetch app data and assign it to ApplicationConfig
const fetchAppData = async () => {
  const document = String(key); 
  const appData = await getAppData<AppDataType>('app_name', document );
  
  if (appData) {
    ApplicationConfig = {
      ...appData,         // Spread the data fetched from Firestore
      securityKey: key,   // Add the securityKey to the object
    };
  } else {
    console.log('No app data found');
  }
};

// Call the fetchAppData function to load the data on app start
fetchAppData();

// Now you can access ApplicationConfig anywhere in your app
