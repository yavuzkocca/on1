import { useMemo, useEffect, useState } from "react";
import { Platform } from "react-native";

import { Video } from "expo-av";

import { Image, ResizeMode } from "@showtime-xyz/universal.image";
import { styled } from "@showtime-xyz/universal.tailwind";

import { contentFitToresizeMode } from "app/utilities";

export const supportedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
export const supportedVideoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

type PreviewProps = {
  file?: File | string;
  type?: "image" | "video";
  tw?: string;
  style?: any;
  resizeMode?: ResizeMode;
  width: number;
  height: number;
};

const StyledVideo = styled(Video);

export const PreviewPrivate = ({
  tw = "",
  style,
  type,
  file,
  resizeMode = "cover",
  width,
  height,
}: PreviewProps) => {
  const uri = getLocalFileURI(file);
  const [blurredImage, setBlurredImage] = useState<string | null>(null);
  //BLUR YAVRUM
  // Blur yapma fonksiyonu
  async function blurImage(url, radius) {
    return new Promise((resolve, reject) => {
      // Görüntüyü yükle
      const img = document.createElement("img");
      img.crossOrigin = "Anonymous"; // Cross-origin hatası için gerekli
      img.onload = () => {
        // Görüntüyü blur yap
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = `blur(${radius}px)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Blur yapılmış görüntüyü blob olarak al
        canvas.toBlob((blob) => {
          const blurredUrl = URL.createObjectURL(blob);
          resolve(blurredUrl);
        });
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  }

  // BlurredImage'i yükle
  useEffect(() => {
    if (uri) {
      blurImage(uri, 10)
        .then((blurredImageUrl) => {
          setBlurredImage(blurredImageUrl);
        })
        .catch((error) => {
          console.error("Blur yapılırken hata oluştu:", error);
        });
    }
  }, []);

  console.log(`PREVIEWURI=${uri}`);
  console.log(`PREVIEWURINsss=${blurredImage}`);
  const fileType = useMemo(() => {
    if (type) return type;

    if (typeof file === "string") {
      // try to get file type from file extension
      const fileExtension =
        typeof file === "string" ? file?.split(".").pop() : undefined;
      const isVideo =
        (fileExtension && supportedVideoExtensions.includes(fileExtension)) ||
        file.includes("data:video/");

      return isVideo ? "video" : "image";
    } else if (typeof file === "object") {
      return file?.type.includes("video") ? "video" : "image";
    }
  }, [file, type]);

  if (uri) {
    if (fileType === "image") {
      return (
        <Image
          tw={tw}
          style={style}
          resizeMode={resizeMode}
          source={{
            uri: blurredImage as string,
          }}
          width={width}
          height={height}
          onLoad={() => {
            revokeObjectURL(blurredImage);
          }}
          alt="Preview Image"
        />
      );
    }

    if (fileType === "video") {
      return (
        <StyledVideo
          tw={tw}
          style={[{ width, height }, style]}
          resizeMode={contentFitToresizeMode(resizeMode)}
          source={{ uri: uri as string }}
          isMuted
          shouldPlay
          onLoad={() => {
            revokeObjectURL(uri);
          }}
        />
      );
    }
  }

  return null;
};

export const getLocalFileURI = (file?: string | File) => {
  if (!file) return null;

  if (typeof file === "string") return file;

  if (Platform.OS === "web") return (URL || webkitURL)?.createObjectURL(file);

  return file;
};
/**
 * Browsers will release object URLs automatically when the document is unloaded;
 * for optimal performance and memory usage
 * if there are safe times when you can explicitly unload them, you should do so.
 * @param uri
 * @returns
 */
export const revokeObjectURL = (uri: any) => {
  if (!uri || Platform.OS !== "web" || typeof uri !== "string") return;
  (URL || webkitURL).revokeObjectURL(uri);
};
