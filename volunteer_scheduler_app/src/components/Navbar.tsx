import React from "react";
import "../App.css";
import { Button, Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
// import {removeUserSession} from "../Utils";

export interface NavbarProps {
  setPageApp(page: string): void;
}

export const Navbar: React.FC<NavbarProps> = ({ setPageApp }) => {
  // const handleLogOut = () => {
  //     removeUserSession()
  //     setPageApp("Login")
  // };
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
    setPageApp("AddEvent");
  };
  const handleAddAdmin = () => {
    console.log("handleAddAdmin");
    setPageApp("AddAdmin");
  };
  const handleCurrentAdminsList = () => {
    console.log("handleCurrentAdminsList");
    setPageApp("CurrentAdminsList");
  };
  const handleProfile = () => {
    console.log("handleProfile");
    setPageApp("Profile");
  };
  const handleLogin = () => {
    console.log("handleLogin");
    setPageApp("Login");
  };

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
      <Box sx={{ width: "80%" }}>
        <ButtonGroup
          size="large"
          color="info"
          variant="text"
          aria-label="text button group"
          fullWidth={true}
        >
          {/* <Button color={"secondary"} onClick={handleLogOut}> <LogoutIcon color={"secondary"}/>  Log out </Button> */}
          <Button onClick={handlePersonalEventsCalendar}>
            Personal Events Calendar
          </Button>
          <Button onClick={handleGeneralEventsCalendar}>
            General Events Calendar
          </Button>
          <Button onClick={handleAddEvent}>Add Event</Button>
          <Button onClick={handleAddAdmin}>Add Admin</Button>
          <Button onClick={handleCurrentAdminsList}>Current Admins List</Button>
          <Button onClick={handleProfile}>Profile</Button>
          <Button onClick={handleLogin}>Login</Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
