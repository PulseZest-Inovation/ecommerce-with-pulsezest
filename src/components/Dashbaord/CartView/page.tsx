import React, { useEffect, useState } from "react";
import { Drawer, Avatar, List, Badge, Typography, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CartDrawer from "./CartDrawer";
import FavouriteDrawer from "./FavouriteDrawer";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { CustomerType } from "@/types/Customer";
import { CartType } from "@/types/CartType";
import { AppDataType } from "@/types/AppData";
import { getAppData } from "@/services/getApp";

export default function CartView() {
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState<boolean>(false);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [appData, setAppData] = useState<AppDataType | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);

  const toggleCartDrawer = (customer?: CustomerType): void => {
    setSelectedCustomer(customer || null);
    setCartDrawerOpen(!!customer);
  };

  const toggleFavDrawer = (): void => setFavDrawerOpen(!favDrawerOpen);

  useEffect(() => {
    const fetchCustomer = async (): Promise<void> => {
      try {
        const customerData = await getAllDocsFromCollection<CustomerType>("customers");
        const customersWithCart = await Promise.all(
          customerData.map(async (customer) => {
            const cartData = await getAllDocsFromCollection<CartType>(
              `customers/${customer.id}/cart`
            );
            return { ...customer, cart: cartData || [] };
          })
        );
        setCustomers(customersWithCart);
      } catch (error) {
        console.error("Error fetching customers with cart:", error);
      }
    };

    const fetchAppData = async () => {
      try {
        const key = localStorage.getItem("securityKey");
        if (!key) throw new Error("No security key found in localStorage!");
        const appData = await getAppData<AppDataType>("app_name", key);
        setAppData(appData);
      } catch (error) {
        console.error("Error fetching app data:", error);
      }
    };

    fetchCustomer();
    fetchAppData();
  }, []);

  const currentDate: string = new Date().toLocaleDateString();

  return (
    <div
      style={{
        width: 400,
        padding: 16,
        backgroundColor: "#67cf8a",
        borderRadius: 10,
        overflowY: "auto",
      }}
    >
      <Typography.Title level={5} style={{ textAlign: "center" }}>
        Your Customer Updates
      </Typography.Title>
      <List
        dataSource={customers}
        renderItem={(customer) => (
          <List.Item
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              marginBottom: 10,
              padding: 10,
            }}
            actions={[
              <Badge count={customer.cart?.length || 0} key={customer.id}>
                <Button
                  icon={<ShoppingCartOutlined />}
                  onClick={() => toggleCartDrawer(customer)}
                />
              </Badge>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={customer.profileUrl ?? "https://via.placeholder.com/50"}
                  size={50}
                />
              }
              title={customer.fullName || "Unknown User"}
              description={`Phone: ${
                customer.phoneNumber || "N/A"
              } | Last Update: ${currentDate}`}
            />
          </List.Item>
        )}
      />

      {selectedCustomer && (
        <CartDrawer
          selectedCustomer={selectedCustomer}
          cartDrawerOpen={cartDrawerOpen}
          toggleCartDrawer={() => toggleCartDrawer()}
          cartProducts={selectedCustomer.cart?.map((product) => ({
            ...product,
            slug: product.slug || "default-slug", // Provide a default value if missing
          })) ?? []} // Ensure it's never undefined
          phoneNumber={selectedCustomer.phoneNumber || "N/A"}
          website={appData?.callback_url || "empty"}
        />
      )}

      <FavouriteDrawer
        markAsRead={() => {}}
        favDrawerOpen={favDrawerOpen}
        toggleFavDrawer={toggleFavDrawer}
        favoriteProducts={[]}
      />
    </div>
  );
}
