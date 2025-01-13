import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import EightMpIcon from '@mui/icons-material/EightMp';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';

import type { MenuProps } from "antd";
import { SkuIcon, TaxIcon } from "@/components/Icons/page";

export const ProductOtherTabMenu: MenuProps["items"] = [
  {
    key: "price",
    label: "Price",
    icon: <CurrencyRupeeIcon />,
  },
  {
    key: "readyToWear",
    label: "Ready to Wear",
    icon: <AlarmOnIcon />,
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
    key: "sku",
    label: "SKU",
    icon: <SkuIcon />,
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