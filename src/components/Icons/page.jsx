import React from 'react';
import Image from 'next/image';

const ProductIcon = () => {
  return (
    <Image
      src="/icons/product.png" // Path relative to the `public` folder
      alt='auto-rickshaw'
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
      alt='car'
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
      alt='car'
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
      alt='car'
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
      alt='car'
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
      alt='car'
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
      alt='car'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const PendingOrderIcon = () => {
  return (
    <Image
      src="/icons/reviewsandrating.png" // Path relative to the `public` folder
      alt='car'
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
      alt='car'
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
      alt='car'
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
      alt='car'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

export { AddProuducts, AllProduct, ProductIcon, OrderIcon,
   CustomerIcon,
   ManageCategoriesIcon,
     ReviewAndRatingIcon,
     PendingOrderIcon, OrderCompeltedIcon, DiscountIcon, TestimonialIcon };
