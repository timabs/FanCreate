import React, { createContext, useContext, useState } from "react";

const ImageContext = createContext();

export function useImage() {
  return useContext(ImageContext);
}

export function ImageProvider({ children }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const updateImage = (imageURL) => {
    setUploadedImages((prevImages) => [...prevImages, imageURL]);
  };
  return (
    <ImageContext.Provider value={{ uploadedImages, updateImage }}>
      {children}
    </ImageContext.Provider>
  );
}
