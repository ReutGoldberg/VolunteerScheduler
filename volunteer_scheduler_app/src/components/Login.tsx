import React from "react";
import { Button, Box, TextField } from "@mui/material";
import jwt_decode from "jwt-decode";


import {
  isNewUser,
  createUser,

} from "../utils/DataAccessLayer";
import { AppConfig } from "../AppConfig";
import { UserObjectContext } from "../App";
import { FakeDataGen } from "./FakeDataGen";
//import { KeyboardReturnOutlined } from "@mui/icons-material";
export interface LoginProps {
  setPageApp(page: string): void;
  setUserAuth(user: any): void;
}

export const Login: React.FC<LoginProps> = ({ setPageApp, setUserAuth }) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_CONTENT = `${CLIENT_ID}.apps.googleusercontent.com`;
  const clientId: string = AppConfig.client_id;

  const { setUser } = React.useContext(UserObjectContext);

  async function handleCallbackResponse(response: any) {
    const googleUserToken: string = String(response.credential);
    const token = { token: googleUserToken };
    //adding the whole token as part of the userObject
    const userObject: any = { ...jwt_decode(googleUserToken), ...token };
    setUser(userObject); //sets the App's context

    const isNewUserResult = await isNewUser(token.token);
    if (isNewUserResult) {
      createUser(token.token);
    }

    document.getElementById("signInDiv")!.hidden = true;
    setUserAuth(userObject);
    window.sessionStorage.setItem(
      AppConfig.sessionStorageContextKey,
      JSON.stringify(userObject)
    );

    setPageApp("GeneralEventsCalendar");

    //window.location.reload();
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
    // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log("Name: " + profile.getName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

 
  return (
    <Box
      sx={{
        width: "30%",
        height: "100%",
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
      {AppConfig.IS_SHOW_FAKE && <FakeDataGen/>}
    </Box>
  );
};



