// src/theme/index.ts
import { createTheme } from "@mui/material/styles";
import "@mui/material/styles";
import type { ComponentsPropsList } from "@mui/material";
import type { ComponentsOverrides, Theme } from "@mui/material/styles";
import { Padding } from "@mui/icons-material";
import { text } from "stream/consumers";

declare module "@mui/material/styles" {
  interface TypeText {
    light?: string;
    active?: string;
  }
  interface TypeBackground {
    blue?: string;
    active?: string;
  }
  interface Components {
    MuiDataGrid?: {
      defaultProps?: object;
      styleOverrides?: object;
    };
  }
}

export const colors = {
  primary: "#003554",
  secondary: "#3DA5D9",
  primaryLight: "#1976d2",
  divider: "#E0E0E0",
  bgcBlue: "#E6EEF2",
  paper: "#FFFFFF",
  textPrimary: "#212121",
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#003554",
    },
    secondary: {
      main: "#3DA5D9",
    },
    success: {
      main: "#2E7D32",
    },
    error: {
      main: "#D32F2F",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
      blue: "#E6EEF2",
      active: "#A4C1D4",
    },
    divider: colors.divider,
    text: {
      primary: "#212121",
      secondary: "#616161",
      light: "#ffffff",
      active: "#003554",
    },
  },

  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "2.5rem", // 40px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2rem", // 32px
      fontWeight: 600,
      lineHeight: 1.25,
      marginBlockStart: "0.5rem",
    },
    h3: {
      fontSize: "1.75rem", // 28px
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem", // 24px
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem", // 20px
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem", // 16px
      fontWeight: 500,
    },

    subtitle1: {
      fontSize: "1rem", // 16px
      fontWeight: 400,
      color: "#616161",
    },
    subtitle2: {
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      color: "#616161",
    },

    body1: {
      fontSize: "1rem", // 16px
      color: "inherit",
    },
    body2: {
      fontSize: "0.875rem", // 14px
    },
    button: {
      fontSize: "1rem",
      fontWeight: 500,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem", // 12px
      color: "#9e9e9e",
    },
  },

  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          fontFamily: "inherit",
          fontSize: "14px",
          color: colors.textPrimary,
        },
        columnHeaders: {
          backgroundColor: "#fafafa",
          fontWeight: 600,
          fontSize: "14px",
          color: "#333",
          borderBottom: `1px solid ${colors.divider}`,
        },
        columnHeaderTitle: {
          whiteSpace: "normal",
          lineHeight: "1.4rem",
        },
        cell: {
          paddingTop: 0,
          paddingBottom: 0,
          display: "flex",
          alignItems: "center",
        },
        row: {
          "&:hover": {
            backgroundColor: `${colors.bgcBlue}`,
          },
        },
        footerContainer: {
          justifyContent: "flex-end",
          padding: "16px",
        },
        checkboxInput: {
          color: `${colors.secondary}`,
        },
      },
      defaultProps: {
        disableColumnMenu: true,
        disableSelectionOnClick: true,
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 4,
          marginLeft: 4,
          marginRight: 4,
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 500,
          height: "24px",
          fontSize: "13px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: `${colors.paper}`,
          fontSize: "14px",
          "& fieldset": {
            borderColor: "#ddd",
          },
          "&:hover fieldset": {
            borderColor: "#aaa",
          },
          "&.Mui-focused fieldset": {
            borderColor: `${colors.primaryLight}`,
          },
        },
        input: {
          padding: "10px 12px",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "uppercase",
          fontWeight: 600,
          padding: "6px 16px",
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
  },
});

export default theme;
