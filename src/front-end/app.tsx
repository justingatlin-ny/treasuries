import {CssBaseline} from "@mui/material";
import ReactDOM from "react-dom/client";
import Layout from "./components/Layout";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const App = () => {
  return (
    <>
      <CssBaseline />
      <Layout />
    </>
  );
};

root.render(<App />);
