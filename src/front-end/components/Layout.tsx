import {
  Container,
  Paper,
  Typography,
  createTheme,
  ThemeProvider,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from "@mui/material";
import Main from "./Main";

declare module "@mui/material/styles" {
  // You can change "subtitle3" name with that you defined in your "theme.js" named of variant's name.
  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // Allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: "body3",
          },
          style: {
            fontSize: 36,
          },
        },
      ],
    },
  },
});

const Layout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              When to Buy Treasuries
            </Typography>
          </Toolbar>
        </AppBar>
        <Main />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
