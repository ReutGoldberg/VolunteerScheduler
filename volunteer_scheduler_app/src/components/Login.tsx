import React from "react";
import "../App.css";
import { Button, Box } from "@mui/material";
import jwt_decode from "jwt-decode";

export interface NavbarProps {
  setPageApp(page: string): void;
  setUserAuth(user: any): void;
}

export const Login: React.FC<NavbarProps> = ({ setPageApp, setUserAuth }) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_CONTENT = `${CLIENT_ID}.apps.googleusercontent.com`;
  const clientId: string =
    "83163129776-q90s185nilupint4nb1bp0gsi0fb61vs.apps.googleusercontent.com"; //todo: put in Config/ .env file

  function handleCallbackResponse(response: any) {
    console.log("Encoded JWT ID Token" + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject); //todo - remove when done bulding
    document.getElementById("signInDiv")!.hidden = true;
    setUserAuth(userObject);
    setPageApp("GeneralEventsCalendar");
  }

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
      {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: "100px",
      }
    );
    google.accounts.id.prompt();
  }, []);

  /* End google login part*/
  function onSignIn(googleUser: any) {
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  return (
    <Box
      sx={{
        width: "30%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        id="signInDiv"
      ></Box>
    </Box>
  );
};
