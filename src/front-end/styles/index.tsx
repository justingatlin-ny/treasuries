import {styled, Grid2, createTheme} from "@mui/material";
import {BondDisplayContainerProps} from "../types";
import {red} from "@mui/material/colors";

export const BondDisplayContainer = styled(Grid2, {
  shouldForwardProp: (prop) => prop !== "displaysettings",
})<BondDisplayContainerProps>(({displaysettings}) => ({
  ...Object.entries(displaysettings).reduce(
    (acc, [key, value]) => {
      if (!value) {
        acc[`.${key}`] = {display: "none"};
      }
      return acc;
    },
    {} as Record<string, {[key: string]: string}>
  ),
}));

export const AssetDurationContainer = styled(Grid2)(({theme}) => ({
  "&.past .MuiPaper-root": {
    color: theme.status.past,
  },
}));

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      past: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    status?: {
      past?: string;
    };
  }
}

export const theme = createTheme({
  status: {
    past: red["500"],
  },
});
