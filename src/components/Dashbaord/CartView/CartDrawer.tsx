import React, { useMemo } from "react";
import { Drawer, Typography, Divider, List, Avatar, Button } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";

interface CartProduct {
  id: string;
  productTitle: string;
  price: number;
  slug: string;
  image?: string;
}

interface CustomerType {
  id: string;
  fullName: string;
  phoneNumber: string;
}

interface CartDrawerProps {
  cartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  selectedCustomer: CustomerType | null;
  cartProducts: CartProduct[];
  website: string;
  phoneNumber: string;
}

const handleWhatsAppClick = (
  fullName: string,
  phone: string,
  website: string
) => {
  const checkoutLink = `${website}/checkout`;

  const message = `Hi ${fullName}, We noticed you left some great items in your cart at https://apnimaativastram.com/. They’re still waiting for you! 🎉

Get a special 10% OFF just for you! Use code FIRST10 at checkout. But hurry—this offer expires soon! ⏳

Complete your purchase here: ${checkoutLink}

Need any help? We’re here for you! 😊

- Shravani
Apni Maati Vastram`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(url, "_blank");
};

export default function CartDrawer({
  cartDrawerOpen,
  toggleCartDrawer,
  selectedCustomer,
  cartProducts,
  website,
  phoneNumber,
}: CartDrawerProps) {
  const customerName = useMemo(
    () => selectedCustomer?.fullName || "Guest",
    [selectedCustomer]
  );
  const customerPhone = useMemo(
    () => selectedCustomer?.phoneNumber || phoneNumber || "",
    [selectedCustomer, phoneNumber]
  );

  return (
    <Drawer
      title={`${customerName}'s Cart`}
      placement="right"
      onClose={toggleCartDrawer}
      open={cartDrawerOpen}
      width={400}
      className="p-4"
    >
      <Divider />
      {cartProducts.length > 0 ? (
        <List
          dataSource={cartProducts}
          renderItem={(product) => (
            <List.Item className="flex items-center gap-4">
              <Avatar
                shape="square"
                size={50}
                src={product.image || "https://via.placeholder.com/50"}
                className="rounded-lg"
              />
              <div className="flex-1">
                <Typography.Text strong>{product.productTitle}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  ₹{product.price.toLocaleString("en-IN")}
                </Typography.Text>
              </div>
              <Button
                type="primary"
                shape="circle"
                icon={<WhatsAppOutlined />}
                onClick={() =>
                  handleWhatsAppClick(customerName, customerPhone, website)
                }
                disabled={!customerPhone}
                className="bg-green-500 border-none text-white"
              />
            </List.Item>
          )}
        />
      ) : (
        <Typography.Text type="secondary" className="mt-4 block">
          No products in the cart.
        </Typography.Text>
      )}
    </Drawer>
  );
}
