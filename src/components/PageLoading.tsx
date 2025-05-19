import React from "react";
import { CircularProgress, Box } from "@mui/material";

interface PageLoadingProps {
  loading: boolean; // 控制是否显示加载动画
  size?: number; // 加载动画的大小
  color?: string; // 加载动画的颜色
  message?: string; // 加载时的提示信息
}

const PageLoading: React.FC<PageLoadingProps> = ({
  loading,
  size = 40,
  color = "primary",
  message,
}) => {
  if (!loading) return null; // 如果不显示加载动画，直接返回 null

  return (
    <Box
      sx={{
        position: "fixed", // 固定定位
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // 半透明背景
        zIndex: 9999, // 确保在最上层
      }}
    >
      <CircularProgress size={size} color={color as "primary" | "secondary" | "inherit"} />
      {message && <Box sx={{ mt: 2, color: "text.secondary" }}>{message}</Box>}
    </Box>
  );
};

export default PageLoading;
