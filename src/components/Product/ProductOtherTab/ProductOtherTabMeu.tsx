import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import EightMpIcon from '@mui/icons-material/EightMp';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';

import type { MenuProps } from "antd";
import { SkuIcon, TaxIcon, ReturnAndExchangeIcon, RatingIcon, VolumeIcon } from "@/components/Icons/page";

export const ProductOtherTabMenu: MenuProps["items"] = [
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
    key: "returnAndExchange",
    label: "Return & Exchange",
    icon: <ReturnAndExchangeIcon />,
  },
  {
    key: "ready",
    label: "Ready",
    icon: <AlarmOnIcon />,
  },
  {
    key: "stock",
    label: "Product Stock",
    icon: <Inventory2Icon />,
  },
  {
    key: "volume",
    label: "volume",
    icon: <VolumeIcon />,
  },
  {
    key: "sku",
    label: "SKU",
    icon: <SkuIcon />,
  },
  {
    key: "rating",
    label: "Rating",
    icon: <RatingIcon />,
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