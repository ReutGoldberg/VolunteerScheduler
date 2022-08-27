import { Box, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "kalend/dist/styles/index.css"; // import styles
import React from "react";
import "./App.css";
import { AddAdmin } from "./components/AddAdmin";
import { AdminsList } from "./components/AdminsList";
import { PersonalEventsCalendar } from "./components/PersonalEventsCalendar";
import { Navbar } from "./components/Navbar";
import { lightTheme } from "./theme";
import { Login } from "./components/Login";
import { GeneralEventsCalendar } from "./components/GeneralEventsCalendar";
import { Profile } from "./components/Profile";
import { getPage } from "./utils/helper";
import { AddOrEditEvent } from "./components/AddOrEditEvent";
import { AppConfig } from "./AppConfig";
import { Footer } from "./components/Footer";

export const UserObjectContext = React.createContext<any>({
  user: "",
  setUser: () => {},
});

//todo: maybe make generic and pass a callback

function App() {
  const [user, setUser] = React.useState<any>({});
  const [page, setPage] = React.useState<string>(getPage());

  const userValue = React.useMemo(() => ({ user, setUser }), [user]);

  const setPageApp = (page: string) => {
    setPage(page);
  };

  function isUserExists() {
    const data: string =
      window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || "";
    if (data === "") return false;

    return true;
  }

  //This hook will set the value to the localStorage upon erasing the User on Refresh
  React.useEffect(() => {
    if (JSON.stringify(user) !== "{}") {
      //making sure I'm not saving an erased context to the localstorage
      console.log(`Setting Context!!! ${JSON.stringify(user)}`);
      window.sessionStorage.setItem(
        AppConfig.sessionStorageContextKey,
        JSON.stringify(user)
      );
    }
  }, [user]);

  //This hook will be fetching the data from the localstorage upon page refresh
  React.useEffect(() => {
    const data: string =
      sessionStorage.getItem(AppConfig.sessionStorageContextKey) || "";

    if (data !== "" && JSON.stringify(user) === "{}") {
      console.log(`Fetching Context!!! ${data}`);
      setUser(JSON.parse(data));
    }
  }, []);

  const pageToPresent = (page: string) => {
    // if(not auth) return <Login setPageApp={setPageApp} setUserAuth={setUserAuth}
    sessionStorage.setItem("page", page);
    switch (page) {
      case "PersonalEventsCalendar":
        return <PersonalEventsCalendar />;
      case "GeneralEventsCalendar":
        return <GeneralEventsCalendar />;
      // case "AdminsList": //todo: remove this as this is united with AddAdmin now :)
      //   return <AdminsList curAdminList={[]}/>;
      case "AddOrEditEvent":
        return <AddOrEditEvent toEditEventDetails={null} />;
      case "AddAdmin":
        return <AddAdmin />;
      case "Profile":
        return <Profile />;
      case "Login":
        return <Login setPageApp={setPageApp} setUserAuth={setUser} />;
      default:
        return <Login setPageApp={setPageApp} setUserAuth={setUser} />;
    }
  };
  return (
    <UserObjectContext.Provider value={userValue}>
      <UserObject />
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
          {isUserExists() && (
            <Navbar setPageApp={setPageApp} setUserAuth={setUser} />
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
          <Footer />
        </div>
      </ThemeProvider>
    </UserObjectContext.Provider>
  );
}

//this object is for the useMemo hook, evertyihng below it being memoized, so the app doesn't re-render the user object if it
// didn't change
function UserObject() {
  const { userObj, setUserObject } = React.useContext(UserObjectContext);
  const changeHandler = (event: any) => setUserObject(event?.target?.value);
  return <input hidden={true} value={userObj} onChange={changeHandler} />;
}

export default App;
