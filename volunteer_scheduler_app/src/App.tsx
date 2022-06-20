import { Box, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "kalend/dist/styles/index.css"; // import styles
import React, { useState } from "react";
import "./App.css";
import { AddAdmin } from "./components/AddAdmin";
import { AddEvent } from "./components/AddEvent";
import { CurrentAdminsList } from "./components/CurrentAdminsList";
import { PersonalEventsCalendar } from "./components/PersonalEventsCalendar";
import { Navbar } from "./components/Navbar";
import { lightTheme } from "./theme";
import { Login } from "./components/Login";
import { GeneralEventsCalendar } from "./components/GeneralEventsCalendar";
import { Profile } from "./components/Profile";
import { getPage } from "./utils/helper";
import jwt_decode from "jwt-decode";

function App() {
  const [user, setUser] = React.useState<any>({});
  /*Google Login Part*/
  //this is the function that handles/runs after the user logs in successfully
  function handleCallbackResponse(response: any) {
    console.log("Encoded JWT ID Token" + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv")!.hidden = true;
  }

  function handleSignOut(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    setUser({});
    document.getElementById("signInDiv")!.hidden = false;
  }

  const clientId: string =
    "83163129776-q90s185nilupint4nb1bp0gsi0fb61vs.apps.googleusercontent.com"; //todo: put in Config/ .env file
  React.useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse,
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById("signInDiv")!,
      // @ts-ignore
      { theme: "outline", size: "large", shape: "pill" }
    );
    google.accounts.id.prompt();
  }, []);

  /* End google login part*/

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
        <div id="signInDiv"></div>
        {Object.keys(user).length != 0 && (
          <button onClick={(e) => handleSignOut(e)}>sign out</button>
        )}
        {user && (
          <div>
            <img src={user.picture}></img>
            <h3>{user.name}</h3>
          </div>
        )}
        {Object.keys(user).length != 0 && <Navbar setPageApp={setPageApp} />}
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
