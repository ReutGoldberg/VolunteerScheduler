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




export const UserObjectContext =  React.createContext<any>({
  user: '',
  setUser: () => {},
});

function App() {

  const [user, setUser] = React.useState<any>({});
  const [page, setPage] = React.useState<string>(getPage());

  const userValue = React.useMemo(
    ()=> ({user, setUser}), [user]
  );


  const setPageApp = (page: string) => {
    setPage(page);
  };

  //  todo: remove below after merge with master - confirmed no need for this wrapper. Just use setUser instead which does the same
  // confirmed there are no errors after the change in the App
  // const setUserAuth = (user: any) => {
  //   setUser(user);
  // };

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
        return <AdminsList curAdminList={[]}/>;
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
      <UserObject/>
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
        </div>
      </ThemeProvider>    
    </UserObjectContext.Provider>
  );
}

function UserObject() {
  const { userObj, setUserObject } = React.useContext(UserObjectContext);
  const changeHandler = (event:any) => setUserObject(event?.target?.value)
  return (
    <input
      hidden={true}
      value={userObj}
      onChange={changeHandler}
    />
  );
}

export default App;
