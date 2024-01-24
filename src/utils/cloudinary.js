import axios from "axios";
const apiUrl = "https://fancreate-backend.onrender.com";

export async function getSig() {
  const response = await axios.get(`${apiUrl}/api/v1/auth/signature`);
  return response.data;
}
export const getCloudinaryImgId = (imageURL) => {
  const urlSections = imageURL.split("/");
  let imgId = urlSections.pop().split(".")[0];
  return imgId;
};
export async function uploadImgToCloud(file) {
  const { signature, timestamp, apiKey } = await getSig();
  const imageData = new FormData();
  imageData.append("file", file);
  imageData.append("timestamp", timestamp.toString());
  imageData.append("signature", signature);
  imageData.append("api_key", apiKey);
  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/fancreate/image/upload",
      imageData
    );
    const secureUrl = response.data.url.replace(/^http:/, "https:");
    return secureUrl;
  } catch (error) {
    console.log("Upload failed:", error);
  }
}
export async function deleteImgFromCloud(imageId) {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/images/delete`,
      {
        imageId: imageId,
      },
      { withCredentials: true }
    );
  } catch (error) {
    console.log(error);
  }
}
