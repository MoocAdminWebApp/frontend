import React, { useState, useRef, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";
import { Box, Button, IconButton, Slider, Stack, Avatar } from "@mui/material";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

interface AvatarCropProps {
  imageData?: string;
  imageDataCallBack?: (imageData: string) => void;
}

const AvatarCrop: React.FC<AvatarCropProps> = (prop: AvatarCropProps) => {
  const [imgSrc, setImgSrc] = useState(prop.imageData ?? "");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1); // 1:1 ratio for square crop
  const [editing, setEditing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // 新增：跟踪图像加载状态
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prop.imageData) {
      setImgSrc(prop.imageData);
      setImageLoaded(false); // 重置加载状态
      console.log("Image data updated:", prop.imageData);
    }
  }, [prop.imageData]);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      setImageLoaded(false); // 重置加载状态
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setImageLoaded(true); // 标记图像已加载

    if (aspect) {
      const { width, height } = img;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  // 修复：只有在图像加载完成后才执行crop操作
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current &&
        imageLoaded // 关键：确保图像已加载
      ) {
        try {
          // We use canvasPreview as it's much faster than imgPreview.
          await canvasPreview(
            imgRef.current,
            previewCanvasRef.current,
            completedCrop,
            scale,
            rotate
          );

          let imageData = await cropToBase64();
          if (prop.imageDataCallBack) {
            prop.imageDataCallBack(imageData);
          }
        } catch (error) {
          console.error("Canvas preview error:", error);
          // 类型安全的错误处理
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          if (
            errorMessage.includes("tainted") ||
            errorMessage.includes("cross-origin")
          ) {
            console.warn("Canvas tainted, skipping callback");
            return;
          }
        }
      }
    },
    100,
    [completedCrop, scale, rotate, imageLoaded] // 添加imageLoaded依赖
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(1); // 1:1 ratio for square crop

      if (imgRef.current && imageLoaded) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 1);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  const handleEditClick = () => {
    setEditing(true);
    // 清理文件输入以确保每次都能触发onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };

  async function cropToBase64() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop || !imageLoaded) {
      throw new Error("Crop canvas does not exist or image not loaded");
    }

    try {
      // compute scale based on natural size
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // create a canvas to draw the cropped image
      const canvas = document.createElement("canvas");
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2d context");

      // draw the cropped image onto the canvas
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // convert the canvas to a base64 data URL
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("cropToBase64 error:", error);
      // 类型安全的错误处理
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("tainted") ||
        errorMessage.includes("cross-origin")
      ) {
        throw new Error("图像跨域错误，请重新上传图片");
      }
      throw error;
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* show default image */}
      {!editing && (
        <Avatar
          sx={{ width: 120, height: 120, mb: 2, cursor: "pointer" }}
          src={imgSrc}
        >
          {!prop.imageData && <EditIcon />}
        </Avatar>
      )}

      {/* preview cropped image */}
      {!!completedCrop && imageLoaded && (
        <Box sx={{ mb: 2 }}>
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "2px solid #1976d2",
              borderRadius: "50%", // circular crop preview
              objectFit: "contain",
              width: Math.min(completedCrop.width, 150),
              height: Math.min(completedCrop.height, 150),
            }}
          />
        </Box>
      )}

      {/* crop operation part */}
      {editing && imgSrc && (
        <Box sx={{ maxWidth: "100%", mb: 2 }}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minHeight={100}
            circularCrop // circular crop
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              crossOrigin={imgSrc.startsWith("http") ? "anonymous" : undefined} // 只对HTTP URL设置crossOrigin
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxWidth: "100%",
                maxHeight: "400px",
              }}
              onLoad={onImageLoad}
              onError={(e) => {
                console.error("Image load error:", e);
                setImageLoaded(false);
              }}
            />
          </ReactCrop>
        </Box>
      )}

      {/* Show upload button and scale/rotate controls */}
      <Box sx={{ width: "100%", maxWidth: 300 }}>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={onSelectFile}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={handleEditClick}
          fullWidth
          sx={{ mb: 2 }}
        >
          {imgSrc ? "Change Avatar" : "Upload Avatar"}
        </Button>

        {imgSrc && imageLoaded && (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleToggleAspectClick}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            >
              Toggle aspect {aspect ? "off" : "on"}
            </Button>

            {/* scale control */}
            <Stack
              spacing={2}
              direction="row"
              sx={{ alignItems: "center", mb: 2 }}
            >
              <Box sx={{ minWidth: 50, fontSize: 14 }}>Scale:</Box>
              <Slider
                value={scale}
                min={0.5}
                max={3}
                step={0.1}
                onChange={(_, value) => setScale(value as number)}
                size="small"
                valueLabelDisplay="auto"
              />
            </Stack>

            {/* rotate control */}
            <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
              <Box sx={{ minWidth: 50, fontSize: 14 }}>Rotate:</Box>
              <Slider
                value={rotate}
                min={-180}
                max={180}
                step={1}
                onChange={(_, value) => setRotate(value as number)}
                size="small"
                valueLabelDisplay="auto"
              />
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AvatarCrop;
