import React from 'react';
import Image from 'next/image';

const ProductIcon = () => {
  return (
    <Image
      src="/icons/product.png" // Path relative to the `public` folder
      alt='product'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const AllProduct = () => {
  return (
    <Image
      src="/icons/products.png" // Path relative to the `public` folder
      alt='all-products'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const AddProuducts = () => {
  return (
    <Image
      src="/icons/add.png" // Path relative to the `public` folder
      alt='add'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const ManageCategoriesIcon = () => {
  return (
    <Image
      src="/icons/manage-categories.png" // Path relative to the `public` folder
      alt='categories'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const OrderIcon = () => {
  return (
    <Image
      src="/icons/order.png" // Path relative to the `public` folder
      alt='order'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};


const CustomerIcon = () => {
  return (
    <Image
      src="/icons/customer.png" // Path relative to the `public` folder
      alt='customer'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const ReviewAndRatingIcon = () => {
  return (
    <Image
      src="/icons/reviewsandrating.png" // Path relative to the `public` folder
      alt='reviews-and-rating'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const PendingOrderIcon = () => {
  return (
    <Image
      src="/icons/pending-order.png" // Path relative to the `public` folder
      alt='pending-order'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};
const OrderCompeltedIcon = () => {
  return (
    <Image
      src="/icons/reviewsandrating.png" // Path relative to the `public` folder
      alt='reviews-and-rating'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const DiscountIcon = () => {
  return (
    <Image
      src="/icons/discount.png" // Path relative to the `public` folder
      alt='discount'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const TestimonialIcon = () => {
  return (
    <Image
      src="/icons/testimonial.png" // Path relative to the `public` folder
      alt='testimonail'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const TaxIcon = () => {
  return (
    <Image
      src="/icons/bag.png" // Path relative to the `public` folder
      alt='bag'
      width={20}
      height={20}
      priority // Optional: Ensures the image is optimized
    />
  );
};

const SkuIcon = () => {
  return (
    <Image
      src="/icons/sku.png" // Path relative to the `public` folder
      alt='sku'
      width={20}
      height={20}
      priority // Optional: Ensures the image is optimized
    />
  );
};


const ReturnAndExchangeIcon = () => {
  return (
    <Image
      src="/icons/return.png" // Path relative to the `public` folder
      alt='return-and-exchange'
      width={20}
      height={20}
      priority // Optional: Ensures the image is optimized
    />
  );
};


const RatingIcon = () => {
  return (
    <Image
      src="/icons/star.png" // Path relative to the `public` folder
      alt='raiting'
      width={20}
      height={20}
      priority // Optional: Ensures the image is optimized
    />
  );
};

const AttributeIcon = () => {
  return (
    <Image
      src="/icons/attributes.png" // Path relative to the `public` folder
      alt='Attribute'
      width={20}
      height={20}
      priority // Optional: Ensures the image is optimized
    />
  );
};
 
const VolumeIcon = () => {
  return (
    <Image
      src="/icons/star.png" // Path relative to the `public` folder
      alt='raiting'
      width={20}
      height={20}
      priority // Optional: Ensures the image is optimized
    />
  );
};

const UserGuide = () => {
  return (
    <Image
      src="/icons/user-guide.png" // Path relative to the `public` folder
      alt='raiting'
      width={20}
      height={20}
      priority // Optional: Ensures the image is optimized
    />
  );
};

const GoogleSearchConsole = () => {
  return (
    <Image
      src="/images/google-search-console.svg" // Path relative to the `public` folder
      alt='add'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

export { AddProuducts, AttributeIcon, AllProduct, ProductIcon, UserGuide, OrderIcon, GoogleSearchConsole,
   CustomerIcon,
   ReturnAndExchangeIcon,
   ManageCategoriesIcon,
     ReviewAndRatingIcon,VolumeIcon,
     PendingOrderIcon, OrderCompeltedIcon, DiscountIcon, TestimonialIcon, TaxIcon, SkuIcon, RatingIcon };
