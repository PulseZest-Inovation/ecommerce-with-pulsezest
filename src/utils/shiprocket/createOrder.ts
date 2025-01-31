import { ShipRocketLoginType } from "@/types/shipRocketType";
import { getShiprocketSetting } from "./getShiprocketSetting";
import { OrderType } from "@/types/orderType";
import { message } from "antd";

interface ShipData {
  token: string;
  shipRocketPickup: string | null;
}

// Function to get the Shiprocket token and pickup location
const getShipData = async (): Promise<ShipData> => {
  try {
    // Getting the Shiprocket login credentials
    const shipdata: ShipRocketLoginType | null = await getShiprocketSetting();
    if (!shipdata?.email || !shipdata?.password) {
      throw new Error("Missing Shiprocket credentials");
    }

    // Generate Shiprocket token
    const tokenResponse = await fetch("/api/shiprocket/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: shipdata.email,
        password: shipdata.password,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.token) {
      throw new Error("Failed to retrieve Shiprocket token");
    }

    const token = tokenData.token;
    console.log("Shiprocket Token:", token);

    // Getting the pickup details
    const pickupResponse = await fetch("/api/shiprocket/get-shiprocket-pickup", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pickupData = await pickupResponse.json();
    if (!pickupResponse.ok || !pickupData.pickupData?.data?.shipping_address?.length) {
      throw new Error("Failed to fetch Shiprocket pickup details");
    }

    // Extracting pickup location
    const shipRocketPickup = pickupData.pickupData.data.shipping_address[0].pickup_location;

    if (!shipRocketPickup) {
      throw new Error("Pickup location is empty.");
    }
    console.log(shipRocketPickup);

    return { token, shipRocketPickup };
  } catch (error) {
    console.error("Error getting Shiprocket data:", error);
    message.error("An error occurred while retrieving Shiprocket data.");
    throw error; // Re-throw error to handle in the calling function
  }
};

const handleConfirmedStatusUpdate = async (order: OrderType): Promise<boolean> => {
    try {
      // Get Shiprocket data (token and pickup location)
      const { token, shipRocketPickup } = await getShipData();
  
      if (!shipRocketPickup) {
        throw new Error("Pickup location not found.");
      }
  
      // Constructing dynamic order details from order object
      const orderDetails =  {
        "channel_id": "6113384",
      "order_id": "12345",
      "order_date": "2025-01-30",
      "pickup_location": "home",
      "billing_customer_name": "John Doe",
      "billing_last_name": "Doe",
      "billing_address": "123, Main Street",
      "billing_address_2": "Near Park",
      "billing_city": "New Delhi",
      "billing_pincode": "110001",
      "billing_state": "Delhi",
      "billing_country": "India",
      "billing_email": "johndoe@example.com",
      "billing_phone":  "6396219233",
      "shipping_is_billing": true,
      "order_items": [
        {
          "name": "T-Shirt",
          "sku": "TSHIRT123",
          "units": 1,
          "selling_price": "500",
          "discount": "50",
          "tax": "18",
          "hsn": "6109"
        }
      ],
      "payment_method": "Prepaid",
      "sub_total": "450",
      "length": "10",
      "breadth": "10",
      "height": "10",
      "weight": "0.5"
    };    
  
      console.log(orderDetails);  // Log for debugging
  
      const response = await fetch("/api/shiprocket/create-shiprocket-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderDetails),
      });
  
      const data = await response.json();
      console.log("Order Response:", data);  // Log the full response for debugging
  
      if (!response.ok || !data.success) {
        throw new Error("Failed to create Shiprocket order");
      }
  
      // Successfully created the order, return any relevant data
      console.log("Order created successfully:", data);
      return true;  // Return true if the order creation is successful
    } catch (error) {
      console.error("Error handling confirmed status:", error);
      message.error("An error occurred while handling confirmed status.");
      return false;  // Return false if failure
    }
  };
  

export { handleConfirmedStatusUpdate };
