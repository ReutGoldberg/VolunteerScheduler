import React from "react";
import { Button, Box, TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { generateFakeUser } from "../fakeData";
import {
  isNewUser,
  createUser,
  createFakeUser,
} from "../utils/DataAccessLayer";
import { AppConfig } from "../AppConfig";
import { UserObjectContext } from "../App";
export interface NavbarProps {
  setPageApp(page: string): void;
  setUserAuth(user: any): void;
}

export const Login: React.FC<NavbarProps> = ({ setPageApp, setUserAuth }) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_CONTENT = `${CLIENT_ID}.apps.googleusercontent.com`;
  const clientId: string = AppConfig.client_id;

  const { setUser } = React.useContext(UserObjectContext);

  async function handleCallbackResponse(response: any) {
    const googleUserToken: string = String(response.credential);
    // console.log("Encoded JWT ID Token " + googleUserToken); //todo: remove when done testing
    const token = { token: googleUserToken };
    const userObject: any = { ...jwt_decode(googleUserToken), ...token };
    setUser(userObject); //sets the App's context

    const isNewUserResult = await isNewUser(token.token);
    if (isNewUserResult) {
      createUser(token.token);
    }
    document.getElementById("signInDiv")!.hidden = true;
    setUserAuth(userObject);
    setPageApp("GeneralEventsCalendar");

    window.sessionStorage.setItem(
      AppConfig.sessionStorageContextKey,
      JSON.stringify(userObject)
    );
    window.location.reload();
  }

  //todo remove when done testing or move to a better position.
  //this function takes data from fakeData.ts and sends via the api to DB
  //In order for it to work, the function needs access both to the fakeData API and the server API (this is why it's located here)
  async function handleGenerateFakeData(event: any) {
    //@ts-ignore
    const amount = document.getElementById("fakeDataAmount")?.value;

    const num_data = parseInt(amount);

    for (let index = 0; index < num_data; index++) {
      const fakeUser = generateFakeUser();
      const data = {
        given_name: fakeUser.first_name,
        family_name: fakeUser.last_name,
        email: fakeUser.email,
        token: fakeUser.token,
      };
      createFakeUser(data, data.token);
    }
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
      <TextField
        id="fakeDataAmount"
        type="number"
        helperText="Set the amount of fake data to generate"
        label="Amount"
      ></TextField>
      <Button onClick={(event) => handleGenerateFakeData(event)}>
        {" "}
        Generate Fake Data
      </Button>
    </Box>
  );
};
