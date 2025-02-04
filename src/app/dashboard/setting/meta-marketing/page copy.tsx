import { useState } from "react";
import { Button } from "antd";
import { useRouter } from "next/router";

const MetaIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMetaLogin = () => {
    setIsLoading(true);
    const appId = "YOUR_META_APP_ID";
    const redirectUri = "YOUR_REDIRECT_URI";
    const scope = "pages_show_list,business_management,catalog_management";

    const loginUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
    
    window.location.href = loginUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Connect Your Meta Business</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Connect your Facebook business account to sync products, manage ads, and enhance your eCommerce setup effortlessly.
      </p>
      <Button onClick={handleMetaLogin} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
        {isLoading ? "Connecting..." : "Connect with Meta"}
      </Button>
    </div>
  );
};

export default MetaIntegration;
