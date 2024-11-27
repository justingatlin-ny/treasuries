import {CssBaseline, ThemeProvider} from "@mui/material";
import ReactDOM from "react-dom/client";
import Layout from "./components/Layout";
import {theme} from "./styles";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  );
};

root.render(<App />);
