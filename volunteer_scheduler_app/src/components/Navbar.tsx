import React from "react";
import "../App.css";
import { Button, Box, Typography } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { UserObjectContext } from "../App";

export interface NavbarProps {
  setPageApp(page: string): void;
  setUserAuth(user: any): void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  setPageApp,
  setUserAuth,
  isAdmin,
}) => {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4.7,
        }}
      ></Box>
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
          {isAdmin && (
            <Button id="AddEventBtn" onClick={handleAddEvent}>
              Add Event
            </Button>
          )}
          {isAdmin && (
            <Button id="AddAdminBtn" onClick={handleAddAdmin}>
              Admins
            </Button>
          )}
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
