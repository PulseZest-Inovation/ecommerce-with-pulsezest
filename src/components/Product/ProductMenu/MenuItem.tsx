import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LinkIcon from "@mui/icons-material/Link";

import type { MenuProps } from "antd";

export const items: MenuProps["items"] = [
  {
    key: "price",
    label: "Price",
    icon: <CurrencyRupeeIcon />,
  },
  {
    key: "shipping",
    label: "Shipping",
    icon: <LocalShippingIcon />,
  },
  {
    key: "linkedProduct",
    label: "Linked Product",
    icon: <LinkIcon />,
  },
];