import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LinkIcon from "@mui/icons-material/Link";
import Inventory2Icon from '@mui/icons-material/Inventory2';

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
    key: "stock",
    label: "Product Stock",
    icon: <Inventory2Icon />,
  },
];