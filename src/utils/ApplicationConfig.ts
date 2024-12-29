import { signOut } from "firebase/auth";
import { auth } from "./firbeaseConfig";

const getSecurityKey = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("securityKey");
  }
  return null; // Default value for server-side
};

const key = getSecurityKey();

if (!key) {
  if (typeof window !== "undefined") {
    console.warn("Security key not found. Signing out...");
    signOut(auth)
      .then(() => console.log("Successfully signed out"))
      .catch((error) => console.error("Error during sign-out:", error));
  }
}

export const ApplicationConfig = {
  securityKey: key,
};
