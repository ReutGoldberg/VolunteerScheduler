import { Box, ThemeProvider, Typography } from "@mui/material";
import "kalend/dist/styles/index.css"; // import styles
import React from "react";
import "./App.css";
import { AddAdmin } from "./components/AddAdmin";
import { PersonalEventsCalendar } from "./components/PersonalEventsCalendar";
import { Navbar } from "./components/Navbar";
import { lightTheme } from "./theme";
import { Login } from "./components/Login";
import { GeneralEventsCalendar } from "./components/GeneralEventsCalendar";
import { getPage, isUserExists } from "./utils/helper";
import { AddOrEditEvent } from "./components/AddOrEditEvent";
import { AppConfig } from "./AppConfig";
import { Footer } from "./components/Footer";
import { isAdminUser } from "./utils/DataAccessLayer";
import AppBar from "./components/AppBar";
import { MaxVolunteer } from "./components/MaxVolunteer";
import { AddLabel } from "./components/AddLabel";

export const UserObjectContext = React.createContext<any>({
  user: "",
  setUser: () => {},
});

function App() {
  const [user, setUser] = React.useState<any>({});
  const [page, setPage] = React.useState<string>(getPage());
  const [isAdmin, setIsAdmin] = React.useState(false);

  const userValue = React.useMemo(() => ({ user, setUser }), [user]);

  const setPageApp = (page: string) => {
    setPage(page);
  };

  const setOpenDialogApp = (openDialogApp: boolean) => {};

  //This hook will set the value to the localStorage upon erasing the User on Refresh
  React.useEffect(() => {
    const userStr: string = JSON.stringify(user);
    if (userStr !== "{}") {
      //making sure I'm not saving an erased context to the localstorage
      console.log(`Setting Context!!! ${userStr}`);
      window.sessionStorage.setItem(
        AppConfig.sessionStorageContextKey,
        userStr
      );
      //updating adminUser as well - fixed refresh admin issues
      isAdminUser(user.token).then((res) => setIsAdmin(res));
    }
  }, [user]);

  //This hook will be fetching the data from the localstorage upon page refresh
  React.useEffect(() => {
    const data: string =
      sessionStorage.getItem(AppConfig.sessionStorageContextKey) || "";

    //Not for initial login - when there's already data in the storage
    if (data !== "" && JSON.stringify(user) === "{}") {
      console.log(`Fetching Context!!! ${data}`);
      setUser(JSON.parse(data));
    }
  }, []);

  //changing isAdmin Verification to an IIFE + .then method and fixing the null issue, introduced above.
  React.useEffect(() => {
    (async function () {
      // async function expression used as an IIFE
      const userObj = user
        ? user
        : JSON.parse(
            window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) ||
              ""
          );
      if (userObj == true) {
        isAdminUser(userObj.token)
          .then((result) => {
            console.log("------------------------------------------");
            console.log("IS_ADMIN REUSLT:" + result);
            console.log("------------------------------------------");
            setIsAdmin(result);
          })
          .catch((err: any) => {
            console.log(`Got Error when tried fetchnig user on Load: ${err}`);
          });
      }
    })();
  }, []);

  //this object is for the useMemo hook, evertyihng below it being memoized, so the app doesn't re-render the user object if it
  // didn't change
  function UserObject() {
    const { userObj, setUserObject } = React.useContext(UserObjectContext);
    const changeHandler = (event: any) => setUserObject(event?.target?.value);
    return <input hidden={true} value={userObj} onChange={changeHandler} />;
  }

  const pageToPresent = (page: string) => {
    sessionStorage.setItem("page", page);
    switch (page) {
      case "PersonalEventsCalendar":
        return <PersonalEventsCalendar />;
      case "GeneralEventsCalendar":
        return <GeneralEventsCalendar />;
      case "AddOrEditEvent":
        return (
          <AddOrEditEvent
            toEditEventDetails={null}
            isAdmin={isAdmin}
            currentPage={"AddOrEditEvent"}
            setOpenDialogApp={setOpenDialogApp}
          />
        );
      case "AddAdmin":
        return <AddAdmin />;
      case "AddLabel":
        return <AddLabel />;
      case "MaxVolunteer":
        return <MaxVolunteer />;
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
          <AppBar />
          {isUserExists() && (
            <Navbar
              setPageApp={setPageApp}
              setUserAuth={setUser}
              isAdmin={isAdmin}
            />
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

export default App;
