import { getUser } from "@/services/getUser";

// Helper function to retrieve appKey
export const getAppKey = async (): Promise<string> => {
  const user = await getUser();
  if (!user || !user.appKey) {
    throw new Error("AppKey is missing from the user data!");
  }
  return user.appKey;
};