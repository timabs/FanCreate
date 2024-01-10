import React from "react";

import { useDispatch } from "react-redux";
import { setIsUploading } from "../redux/chattools";

function ImageUploader({ tempImage, id }) {
  const dispatch = useDispatch();
  const processImage = async (file) => {
    dispatch(setIsUploading(true));
    const maxWidth = 800;
    const maxHeight = 600;
    const reader = new FileReader();

    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          async (blob) => {
            const blobURL = URL.createObjectURL(blob);
            tempImage(blobURL, blob);
            dispatch(setIsUploading(false));
          },
          "image/webp",
          0.9
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  const handleImageChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      processImage(file);
    }
  };

  return (
    <div style={{ width: "0%" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        onClick={(e) => e.stopPropagation()}
        style={{ display: "none" }}
        id={id}
        title="Image Uploader"
      />
    </div>
  );
}

export default ImageUploader;
