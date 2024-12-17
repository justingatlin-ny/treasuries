import {Typography, Box, AppBar, Toolbar} from "@mui/material";
import Main from "./Main";

const Layout = () => {
  return (
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
  );
};

export default Layout;
