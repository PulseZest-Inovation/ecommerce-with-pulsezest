'use client'
import { useState, useEffect } from "react";
import { Button } from "antd";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { useSearchParams, useRouter } from "next/navigation";

const MetaMarketing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasFetchedToken, setHasFetchedToken] = useState(false); 

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchStoredToken();
  }, []);

  useEffect(() => {
    if (searchParams && !hasFetchedToken) {
      const code = searchParams.get("code");
      if (code) {
        fetchAccessToken(code);
        setHasFetchedToken(true);
      }
    }
  }, [searchParams, hasFetchedToken]);

  // 🔹 Fetch stored token and validate it
  const fetchStoredToken = async () => {
    setIsLoading(true);
    const storedToken = await getDataByDocName<{ clientMetaToken: string }>(
      "settings",
      "meta-settings"
    );

    if (storedToken?.clientMetaToken) {
      const isValid = await validateAccessToken(storedToken.clientMetaToken);
      if (isValid) {
        setAccessToken(storedToken.clientMetaToken);
        setIsConnected(true);
      } else {
        console.log("Token expired! Refreshing...");
        refreshAccessToken(storedToken.clientMetaToken);
      }
    }
    setIsLoading(false);
  };

  // 🔹 Validate Token
  const validateAccessToken = async (token: string) => {
    try {
      const res = await fetch(`/api/meta-auth/debug-token?access_token=${token}`);
      const data = await res.json();
      return data.is_valid;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  };

  // 🔹 Refresh Access Token
  const refreshAccessToken = async (expiredToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/meta-auth/refresh-token?access_token=${expiredToken}`);
      const data = await res.json();

      if (data.access_token) {
        console.log("Refreshed Access Token:", data.access_token);

        await setDocWithCustomId("settings", "meta-settings", {
          clientMetaToken: data.access_token
        });

        setAccessToken(data.access_token);
        setIsConnected(true);
      } else {
        console.error("Failed to refresh access token:", data.error);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fetch New Access Token
  const fetchAccessToken = async (code: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/meta-auth/get-token?code=${code}`);
      const data = await res.json();

      if (data.access_token) {
        console.log("Fetched Access Token:", data.access_token);

        await setDocWithCustomId("settings", "meta-settings", {
          clientMetaToken: data.access_token
        });

        setAccessToken(data.access_token);
        setIsConnected(true);
      } else {
        console.error("Failed to get access token:", data.error);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaLogin = () => {
    setIsLoading(true);
    const appId = "1121410479289575";
    const redirectUri = "https://ecommerce-with-pulsezest.vercel.app/dashboard/setting/meta-marketing";
    const scope = "pages_show_list,business_management,catalog_management";

    const loginUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    window.location.href = loginUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Connect Your Meta Business</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Connect your Facebook business account to sync products, manage ads, and enhance your eCommerce setup effortlessly.
      </p>

      {isConnected ? (
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-600">Successfully Connected!</h2>
        </div>
      ) : accessToken ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Access Token:</h2>
          <p className="break-words text-gray-700">{accessToken}</p>
        </div>
      ) : (
        <Button
          onClick={handleMetaLogin}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {isLoading ? "Connecting..." : "Connect with Meta"}
        </Button>
      )}
    </div>
  );
};

export default MetaMarketing;
