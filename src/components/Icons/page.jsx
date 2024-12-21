import React from 'react';
import Image from 'next/image';

const AutoIcon = () => {
  return (
    <Image
      src="/icons/rickshaw.png" // Path relative to the `public` folder
      alt='auto-rickshaw'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const CarIcon = () => {
  return (
    <Image
      src="/icons/car.png" // Path relative to the `public` folder
      alt='car'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

const AddsIcon = () => {
  return (
    <Image
      src="/icons/adds.png" // Path relative to the `public` folder
      alt='car'
      width={25}
      height={25}

      priority // Optional: Ensures the image is optimized
    />
  );
};

export { CarIcon, AutoIcon, AddsIcon };
