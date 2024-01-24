import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { fabric } from "fabric";
function divideImage(dataUrl, height, width) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      const numberOfSlices = Math.ceil(img.height / height);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

      const images = [];

      for (let i = 0; i < numberOfSlices; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, -i * height, img.width, img.height);
        images.push(canvas.toDataURL());
      }

      resolve(images);
    };

    img.onerror = reject;
  });
}
async function addToImages(dividedImages, bannerDataUrl, bottomElementUrl) {
  const bannerImg = await loadImage(bannerDataUrl);
  const bottomImg = await loadImage(bottomElementUrl);

  return Promise.all(
    dividedImages.map(
      (dataUrl) =>
        new Promise((resolve) => {
          fabric.Image.fromURL(dataUrl, (dividedImg) => {
            const canvas = new fabric.StaticCanvas(null, {
              width: dividedImg.width,
              height: dividedImg.height + bannerImg.height + bottomImg.height,
            });
            // Add the banner image at the top
            bannerImg.set({ top: 0, left: 0, selectable: false });
            canvas.add(bannerImg);
            // Add the main divided image
            dividedImg.set({
              top: bannerImg.height,
              left: 0,
              selectable: false,
            });
            canvas.add(dividedImg);
            // Add the bottom image
            bottomImg.set({
              top: dividedImg.height + bannerImg.height,
              left: 0,
              selectable: false,
            });
            canvas.add(bottomImg);
            // Get the combined image data URL
            resolve(canvas.toDataURL());
          });
        })
    )
  );
  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(dataUrl, (img) => {
        if (img) {
          resolve(img);
        } else {
          reject(new Error("Failed to load image."));
        }
      });
    });
  }
}
function applyInlineStyles(original, clone) {
  if (original instanceof SVGElement) {
    clone.setAttribute("class", original.getAttribute("class"));
  } else {
    const originalStyles = window.getComputedStyle(original);

    for (const key of originalStyles) {
      clone.style[key] = originalStyles[key];
    }
  }

  const children = original.children;
  const clonedChildren = clone.children;

  for (let i = 0; i < children.length; i++) {
    applyInlineStyles(children[i], clonedChildren[i]);
  }
}

export const captureChat = async (messagesRef) => {
  // const chatElement = chatRef.current;
  const messagesElement = messagesRef.current;
  // const totalHeight = messagesElement.scrollHeight;
  const visibleHeight = messagesElement.clientHeight;
  // let scrollTop = 0;
  let images = [];

  const msgsClone = messagesElement.cloneNode(true);
  const banner = document.querySelector(".chat-banner");
  const bannerClone = banner.cloneNode(true);
  const bottomElement = document.querySelector(".semantic-input-div");
  applyInlineStyles(banner, bannerClone);
  applyInlineStyles(messagesElement, msgsClone);
  msgsClone.style.overflow = "hidden";

  const msgsImg = await domtoimage.toPng(msgsClone, {
    width: messagesElement.clientWidth,
    height: messagesElement.scrollHeight,
  });

  let bannerImg;
  try {
    bannerImg = await domtoimage.toPng(banner);
  } catch (error) {
    console.error("Error converting banner to image:", error);
  }

  if (!bannerImg) {
    console.error("Failed to set bannerImg, exiting function.");
    return;
  }

  const bottomImg = await domtoimage.toPng(bottomElement);

  const dividedImages = await divideImage(
    msgsImg,
    visibleHeight - 25,
    messagesElement.clientWidth
  );

  const imagesWithBanner = await addToImages(
    dividedImages,
    bannerImg,
    bottomImg
  );

  images = images.concat(imagesWithBanner);
  return images;
};

export const downloadImages = (capturedImages) => {
  if (capturedImages.length === 0) {
    console.log(`No images to download`);
    return;
  }
  if (capturedImages.length === 1) {
    saveAs(capturedImages[0], "chat_image.png");
  } else {
    const zip = new JSZip();
    capturedImages.forEach((img, index) => {
      const imgBlob = dataURLtoBlob(img);
      zip.file(`chat_image_${index + 1}.png`, imgBlob, {
        binary: true,
      });
    });
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "chat_images.zip");
    });
  }
};
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
