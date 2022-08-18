import { Box, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "kalend/dist/styles/index.css"; // import styles
import React, { useState } from "react";
import "./App.css";
import { AddAdmin } from "./components/AddAdmin";
import { AddOrEditEvent } from "./components/AddOrEditEvent";
import { AdminsList } from "./components/AdminsList";
import { PersonalEventsCalendar } from "./components/PersonalEventsCalendar";
import { Navbar } from "./components/Navbar";
import { lightTheme } from "./theme";
import { Login } from "./components/Login";
import { GeneralEventsCalendar } from "./components/GeneralEventsCalendar";
import { Profile } from "./components/Profile";
import { getPage } from "./utils/helper";

function App() {
  /*Google Login Part*/
  //this is the function that handles/runs after the user logs in successfully

  const [user, setUser] = React.useState<any>({});
  const [page, setPage] = React.useState<string>(getPage());

  const setPageApp = (page: string) => {
    setPage(page);
  };

  const setUserAuth = (user: any) => {
    setUser(user);
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
      case "AdminsList":
        return <AdminsList />;
      case "AddOrEditEvent":
        return <AddOrEditEvent toEditEventDetails={null} />;
      case "AddAdmin":
        return <AddAdmin />;
      case "Profile":
        return <Profile />;
      case "Login":
        return <Login setPageApp={setPageApp} setUserAuth={setUserAuth} />;
      default:
        return <Login setPageApp={setPageApp} setUserAuth={setUserAuth} />;
    }
  };
  return (
    <ThemeProvider theme={lightTheme}>
      <div className={"root"}>
        <Box>
          <Typography
            variant="h2"
            color="text.primary"
            textAlign={"center"}
            gutterBottom
            component="div"
          >
            Volunteer Scheduler
          </Typography>
        </Box>
        {Object.keys(user).length != 0 && (
          <Navbar setPageApp={setPageApp} setUserAuth={setUserAuth} />
        )}
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
