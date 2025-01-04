import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import EightMpIcon from '@mui/icons-material/EightMp';

import type { MenuProps } from "antd";
import { TaxIcon } from "@/components/Icons/page";

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
  {
    key: "GST",
    label: "GST Rate",
    icon: <TaxIcon/>,
  },
  {
    key: "HSN",
    label: "HSN Code",
    icon: <EightMpIcon />,
  },
];