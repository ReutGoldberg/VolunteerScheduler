import React from "react";
import "../App.css";
import { Button, Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import LogoutIcon from "@mui/icons-material/Logout";
import { Console } from "console";
// import {removeUserSession} from "../Utils";

// export interface NavbarProps {
//     setPageApp(page:string) : void;
// }

export const Navbar: React.FC = () => {
  // const handleLogOut = () => {
  //     removeUserSession()
  //     setPageApp("Login")
  // };
  const handlePersonalEventsCalendar = () => {
    console.log("handlePersonalEventsCalendar");
  };
  const handleGeneralEventsCalendar = () => {
    console.log("handleGeneralEventsCalendar");
  };
  const handleAddEvent = () => {
    console.log("handleAddEvent");
  };
  const handleAddAdmin = () => {
    console.log("handleAddAdmin");
  };
  const handleCurrentAdminsList = () => {
    console.log("handleCurrentAdminsList");
  };
  const handleProfile = () => {
    console.log("handleProfile");
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
            Personal events calendar
          </Button>
          <Button onClick={handleGeneralEventsCalendar}>
            General events calendar
          </Button>
          <Button onClick={handleAddEvent}>add event</Button>
          <Button onClick={handleAddAdmin}>add admin</Button>
          <Button onClick={handleCurrentAdminsList}>Current Admins List</Button>
          <Button onClick={handleProfile}>profile</Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
