import { Box, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "kalend/dist/styles/index.css"; // import styles
import React from "react";
import "./App.css";
import { AddAdmin } from "./components/AddAdmin";
import { AddEvent } from "./components/AddEvent";
import { CurrentAdminsList } from "./components/CurrentAdminsList";
import { PersonalEventsCalendar } from "./components/PersonalEventsCalendar";
import { Navbar } from "./components/Navbar";
import { lightTheme } from "./theme";
import { Login } from "@mui/icons-material";
import { GeneralEventsCalendar } from "./components/GeneralEventsCalendar";
import { Profile } from "./components/Profile";
import { getPage } from "./utils/helper";

function App() {
  const [page, setPage] = React.useState<string>(getPage());

  const setPageApp = (page: string) => {
    setPage(page);
  };
  const pageToPresent = (page: string) => {
    sessionStorage.setItem("page", page);
    switch (page) {
      case "AddAdmin":
        return <AddAdmin />;
      case "PersonalEventsCalendar":
        return <PersonalEventsCalendar />;
      case "GeneralEventsCalendar":
        return <GeneralEventsCalendar />;
      case "CurrentAdminsList":
        return <CurrentAdminsList />;
      case "AddEvent":
        return <AddEvent />;
      case "AddAdmin":
        return <AddAdmin />;
      case "Profile":
        return <Profile />;
      case "Login":
        return <Login />;
      default:
        return <Login />;
    }
  };
  return (
    <ThemeProvider theme={lightTheme}>
      <div className={"root"}>
        <Navbar setPageApp={setPageApp} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {pageToPresent(page)}
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
