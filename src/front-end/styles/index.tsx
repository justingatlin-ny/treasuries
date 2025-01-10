import {styled, Grid2, createTheme} from "@mui/material";
import {BondDisplayContainerProps} from "../../types";
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
  "&.auctionIsClose .MuiPaper-root .auction": {
    color: theme.status.close,
  },
  "&.maturityIsClose .MuiPaper-root .maturity": {
    color: theme.status.close,
  },
  "&.issueIsClose .MuiPaper-root .issue": {
    color: theme.status.close,
  },
  "&.auctionIsPassed .MuiPaper-root .auction": {
    color: theme.status.past,
  },
  "&.maturityIsPassed .MuiPaper-root .maturity": {
    color: theme.status.past,
  },
  "&.issueIsPassed .MuiPaper-root .issue": {
    color: theme.status.past,
  },
  "&.issueIsPast, &.auctionIsPassed": {
    ".MuiCardHeader-root": {
      textDecoration: "line-through",
    },
  },
}));

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      past: string;
      close: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    status?: {
      past?: string;
      close?: string;
    };
  }
}

export const theme = createTheme({
  status: {
    close: "#c0b261",
    past: red["500"],
  },
  palette: {
    primary: {
      main: "#616fc0",
    },
    secondary: {
      main: "#c0b261",
    },
  },
});
