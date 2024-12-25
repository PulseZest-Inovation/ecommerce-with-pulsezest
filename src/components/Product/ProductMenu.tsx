// import React,{useState} from 'react';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import LinkIcon from '@mui/icons-material/Link';
// import type { MenuProps } from 'antd';
// import { Menu } from 'antd';

// type MenuItem = Required<MenuProps>['items'][number];

// const items: MenuItem[] = [
//   {
//     key: 'price',
//     label: 'Price',
//     type: 'item',
//     icon: <CurrencyRupeeIcon/>
//   },
//   {
//     key: 'shipping',
//     label: 'Shipping',
//     type: 'item',
//     icon: <LocalShippingIcon/>
//   },
//   {
//     key: 'linkedProduct',
//     label: 'Linked Proudct',
//     type: 'item',
//     icon: <LinkIcon/>
//   },
 
// ];

// const ProductMenu: React.FC = () => {
//     const [selectedKey, setSelectedKey] = useState<string>('price');
  
//     const onClick: MenuProps['onClick'] = (e) => {
//         console.log('click ', e.key);
//         setSelectedKey(e.key); // Update selected key
//       };

//   const renderContent = () => {
//     switch (selectedKey) {
//       case 'price':
//         return <PriceComponent />;
//       case 'shipping':
//         return <ShippingComponent />;
//       case 'linkedProduct':
//         return <LinkedProductComponent />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//           <Menu
//             onClick={onClick}
//             style={{ width: 256 }}
//             defaultSelectedKeys={['1']}
//             defaultOpenKeys={['sub1']}
//             mode="inline"
//             items={items}
//         />

//           {/* Component */}
//         <div style={{ marginLeft: 20, flex: 1 }}>
//             {renderContent()}
//         </div>
//     </div>
  
//   );
// };

// export default ProductMenu;