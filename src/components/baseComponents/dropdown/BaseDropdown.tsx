import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";

interface Option {
  value: string | number;
  label: string;
}

type DropdownSize = "small" | "medium" | "large";
const sizeToStyleMap: Record<DropdownSize, React.CSSProperties> = {
  small: { fontSize: "13px", minHeight: 36 },
  medium: { fontSize: "14px", minHeight: 42 },
  large: { fontSize: "16px", minHeight: 50 },
};

type DropdownWidth = "auto" | "default" | "wide" | "xwide";
const widthMap: Record<DropdownWidth, string> = {
  auto: "auto",
  default: "180px",
  wide: "240px",
  xwide: "300px",
};

export interface BaseDropdownProps {
  label?: string;
  helperText?: string;
  options: Option[];
  value: string | number;
  onChange: (event: SelectChangeEvent) => void;
  displayEmpty?: boolean;
  disabled?: boolean;
  size?: DropdownSize;
  width?: DropdownWidth;
  sx?: object;
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  label,
  helperText,
  options,
  value,
  onChange,
  displayEmpty = false,
  disabled = false,
  size = "medium",
  width = "default",
  sx = {},
}) => {
  const labelId = label
    ? `dropdown-label-${label.replace(/\s+/g, "-").toLowerCase()}`
    : undefined;

  const sizeStyle = sizeToStyleMap[size];

  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 160,
        width: widthMap[width || "auto"],
        ...sx,
      }}
      disabled={disabled}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        labelId={labelId}
        value={String(value)}
        onChange={onChange}
        displayEmpty={displayEmpty}
        label={label}
        inputProps={{ "aria-label": label || "dropdown" }}
        sx={{
          fontSize: sizeStyle.fontSize,
          minHeight: sizeStyle.minHeight,
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default BaseDropdown;
