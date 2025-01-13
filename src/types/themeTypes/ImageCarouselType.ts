export interface ImageCarousleType {
    carouselType: string[]; // If this refers to types of carousels
    images: { imageURL: string; pageURL: string }[]; // Updated to include pageURL for each image
    isEnable: boolean;
    selectedType: string;
    desktopImages: CarouselImage[];
    mobileImages: CarouselImage[]; 
  }
  
  export type CarouselImage = {
    imageURL: string;
    pageURL: string;
  };
  