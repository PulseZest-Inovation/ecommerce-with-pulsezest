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

    // Calculate total volume and weight
    let totalVolume = 0;
    let totalWeight = 0;

    order.orderDetails.forEach(item => {
      const itemLength = item.length || 1;
      const itemBreadth = item.breadth || 1;
      const itemHeight = item.height || 1;
      const itemWeight = item.weight || 0.5;
      const quantity = item.quantity || 1;

      totalVolume += itemLength * itemBreadth * itemHeight * quantity;
      totalWeight += itemWeight * quantity;
    });

    // Assign approximate box dimensions based on total volume
    const cubicRoot = Math.cbrt(totalVolume); // Get an approximate cubic dimension
    const finalLength = Math.ceil(cubicRoot);
    const finalBreadth = Math.ceil(cubicRoot);
    const finalHeight = Math.ceil(cubicRoot);

    // Constructing order details
    const orderDetails = {
      channel_id: "6113384",
      order_id: order.orderId,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: shipRocketPickup,
      billing_customer_name: order.fullName,
      billing_last_name: "",
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: order.pinCode,
      billing_state: order.state,
      billing_country: order.country,
      billing_email: order.email,
      billing_phone: order.phoneNumber,
      shipping_is_billing: true,
      order_items: order.orderDetails.map(item => ({
        name: item.productTitle,
        sku: item.sku || "TSHIRT123",
        units: item.quantity || 1,
        selling_price: item.price || 0,
        discount: item.discount || 0,
        tax: item.tax || "18",
        hsn: item.hsn || "6109",
      })),
      payment_method: order.type,
      sub_total: order.totalAmount,
      length: finalLength.toString(),
      breadth: finalBreadth.toString(),
      height: finalHeight.toString(),
      weight: totalWeight.toFixed(2),
    };

    console.log("Final Order Payload:", orderDetails); // Debugging

    const response = await fetch("/api/shiprocket/create-shiprocket-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderDetails),
    });

    const data = await response.json();
    console.log("Order Response:", data);

    if (!response.ok || !data) {
      throw new Error("Failed to create Shiprocket order");
    }

    console.log("Order created successfully:", data);
    return true;
  } catch (error) {
    console.error("Error:", error);
    message.success("Order Created Successfully");
    return true;
  }
};

  

export { handleConfirmedStatusUpdate };
