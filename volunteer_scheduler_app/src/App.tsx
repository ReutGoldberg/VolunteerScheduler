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
import { Login } from "@mui/icons-material";
import { GeneralEventsCalendar } from "./components/GeneralEventsCalendar";
import { Profile } from "./components/Profile";
import { getPage } from "./utils/helper";


function App() {

  /*Google Login Part*/
  //this is the function that handles/runs after the user logs in successfully
  function handleCallbackResponse(response:any){
    console.log("Encoded JWT ID Token" + response.credential);
  }

    const clientId:string = "83163129776-q90s185nilupint4nb1bp0gsi0fb61vs.apps.googleusercontent.com"; //todo: put in Config/ .env file
    React.useEffect(()=> {
           /* global google */
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCallbackResponse
        });
    
      // @ts-ignore
      google.accounts.id.renderButton(
      // @ts-ignore
     document.getElementById("signInDiv")!,
     // @ts-ignore
      {theme: "outline", size: "large",shape: "pill"})
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
