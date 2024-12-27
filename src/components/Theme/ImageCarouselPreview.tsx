import React from 'react';

interface ImageCarouselPreviewProps {
  images: { imageURL: string; altText?: string }[]; // Array of images with their URLs and optional alt text
  style?: React.CSSProperties; // Optional style
}

const ImageCarouselPreview: React.FC<ImageCarouselPreviewProps> = ({ images, style }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px', ...style }}>
      <h3>Image Carousel Preview</h3>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto', // Enables horizontal scrolling
          gap: '10px', // Adds space between images
          paddingBottom: '10px', // Optional: Adds padding to the bottom
          maxWidth: '800px', // Set a max width for the carousel
          margin: '0 auto',
        }}
      >
        {images.map((image, index) => (
          <div key={index} style={{ flexShrink: 0 }}>
            <img
              src={image.imageURL}
              alt={image.altText || `Image-${index}`}
              style={{
                width: '300px', // Fixed width for the images
                height: '200px', // Fixed height for the images
                objectFit: 'cover', // Ensures the image fits within the fixed size
                borderRadius: '8px', // Optional: Adds rounded corners to the images
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarouselPreview;
