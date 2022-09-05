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
import { isAdminUser } from "./utils/DataAccessLayer";

export const UserObjectContext = React.createContext<any>({
  user: "",
  setUser: () => {},
});

//todo: maybe make generic and pass a callback

function App() {
  const [user, setUser] = React.useState<any>({});
  const [page, setPage] = React.useState<string>(getPage());
  const [isAdmin, setIsAdmin] = React.useState(false);

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

  // todo: remove when done testing or fix below
  // React.useEffect(() => {
  //   const genIsAdmin = async () => {
  //     const data =
  //       window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || "";
  //     const userFromStorage = JSON.parse(data);
  //     setIsAdmin(await isAdminUser(userFromStorage.token || ""));
  //   };
  //   // console.log("isAdmin: " + isAdmin);
  //   genIsAdmin();
  // }, []);


//changing isAdmin Verification to an IIFE + .then method and fixing the null issue, introduced above.
React.useEffect(() => {
  (async function () { // async function expression used as an IIFE
    const data: string|null = window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || null;
    const userFromStorage = data === null ? null : JSON.parse(data);
    isAdminUser(userFromStorage?.token || "")
    .then((result) => setIsAdmin(result));
  })();  
}, []);


/*


(async function (x) { // async function expression used as an IIFE
  const p1 = resolveAfter2Seconds(20);
  const p2 = resolveAfter2Seconds(30);
  return x + await p1 + await p2;
})(10).then((v) => {
  console.log(v);  // prints 60 after 2 seconds.
});


*/







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
          />
        );
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

//this object is for the useMemo hook, evertyihng below it being memoized, so the app doesn't re-render the user object if it
// didn't change
function UserObject() {
  const { userObj, setUserObject } = React.useContext(UserObjectContext);
  const changeHandler = (event: any) => setUserObject(event?.target?.value);
  return <input hidden={true} value={userObj} onChange={changeHandler} />;
}

export default App;
