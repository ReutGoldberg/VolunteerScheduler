import { Box, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "kalend/dist/styles/index.css"; // import styles
import React from "react";
import "./App.css";
import { AddAdmin } from "./components/AddAdmin";
import { AddEvent } from "./components/AddEvent";
import { Navbar } from "./components/Navbar";
import { lightTheme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <div className={"root"}>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AddAdmin />
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
