import React from "react";
import "../App.css";
import { Button, Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { UserObjectContext } from "../App";
import { AppConfig } from "../AppConfig";
// import {removeUserSession} from "../Utils";

export interface NavbarProps {
  setPageApp(page: string): void;
  setUserAuth(user: any): void;
}

export const Navbar: React.FC<NavbarProps> = ({ setPageApp, setUserAuth }) => {
  const { user, setUser } = React.useContext(UserObjectContext);

  const handlePersonalEventsCalendar = () => {
    console.log("handlePersonalEventsCalendar");
    setPageApp("PersonalEventsCalendar");
  };
  const handleGeneralEventsCalendar = () => {
    console.log("handleGeneralEventsCalendar");
    setPageApp("GeneralEventsCalendar");
  };
  const handleAddEvent = () => {
    console.log("handleAddEvent");
    setPageApp("AddOrEditEvent");
  };
  const handleAddAdmin = () => {
    console.log("handleAddAdmin");
    setPageApp("AddAdmin");
  };
  const handleAdminsList = () => {
    console.log("handleAdminsList");
    //todo: check if the user has admin preveleges
    setPageApp("AdminsList");
  };
  const handleProfile = () => {
    console.log("handleProfile");
    setPageApp("Profile");
  };

  function handleSignOut(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    setPageApp("Login");
    setUserAuth({});
    sessionStorage.clear();
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          m: 1,
        },
      }}
    >
      <div>
        <img src={user.picture}></img>
        <h3>{user.name}</h3>
      </div>
      <Box sx={{ width: "80%" }}>
        <ButtonGroup
          size="large"
          color="info"
          variant="text"
          aria-label="text button group"
          fullWidth={true}
        >
          {/* <Button color={"secondary"} onClick={handleLogOut}> <LogoutIcon color={"secondary"}/>  Log out </Button> */}
          <Button
            id="PersonalEventsCalendarBtn"
            onClick={handlePersonalEventsCalendar}
          >
            Personal Events Calendar
          </Button>
          <Button
            id="GeneralEventsCalendarBtn"
            onClick={handleGeneralEventsCalendar}
          >
            General Events Calendar
          </Button>
          <Button id="AddEventBtn" onClick={handleAddEvent}>
            Add Event
          </Button>
          <Button id="AddAdminBtn" onClick={handleAddAdmin}>
            Add Admin
          </Button>
          <Button id="ProfileBtn" onClick={handleProfile}>
            Profile
          </Button>
          <Button
            id="LogoutBtn"
            color="error"
            onClick={(e) => handleSignOut(e)}
          >
            Logout
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
