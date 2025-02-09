'use client'
import { signOut } from "firebase/auth";
import { auth } from "./firbeaseConfig";
import { getAppData } from "@/services/getApp";
import { AppDataType } from "@/types/AppData";
import { useEffect } from "react";

// Function to get the security key from localStorage
const getSecurityKey = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("securityKey");
  }
  return null; // Default value for server-side
};

// Declare the ApplicationConfig object with default values
export let ApplicationConfig: AppDataType | null = null;

// Fetch app data and assign it to ApplicationConfig
const fetchAppData = async (key: string | null) => {
  if (key) {
    const appData = await getAppData<AppDataType>();

    if (appData) {
      ApplicationConfig = {
        ...appData,         // Spread the data fetched from Firestore
        securityKey: key,   // Add the securityKey to the object
      };
    } else {
      console.log('No app data found');
    }
  }
};

// Component or custom hook that runs when the app starts
const AppDataLoader = () => {
  useEffect(() => {
    const key = getSecurityKey();
    
    if (!key) {
      console.warn("Security key not found. Signing out...");
      signOut(auth)
        .then(() => console.log("Successfully signed out"))
        .catch((error) => console.error("Error during sign-out:", error));
    } else {
      fetchAppData(key); // Fetch app data if security key exists
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return null; // This component doesn’t render anything
};

export default AppDataLoader;
