import React from "react";
import { Grid, Paper, Box } from "@mui/material";

export interface BaseGridProps {
  cols: number;
  spacing?: number;
  autoSpacing?: boolean;
  children: React.ReactNode[];
}

const BaseGrid: React.FC<BaseGridProps> = ({
  cols,
  spacing = 0,
  autoSpacing = false,
  children,
}) => {
  const gap = spacing;
  const blockWidth = `calc((100% - ${(cols - 1) * gap}px) / ${cols})`;
  return (
    <Box
      sx={{
        width: "95%",
        display: "flex",
        flexDirection: "row",
        justifyContent: autoSpacing ? "space-between" : "flex-start",
        gap: autoSpacing ? undefined : `${gap}px`, // only set gap when autoSpacing is off
        flexWrap: "nowrap",
      }}
    >
      {React.Children.map(children, (child, i) => (
        <Box
          key={i}
          sx={{
            width: blockWidth,
            flexShrink: 0,
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
};

export default BaseGrid;
