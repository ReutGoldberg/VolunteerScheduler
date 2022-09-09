import React from "react";
import { Button, Box, TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { generateFakeUser, generateFakeEvent, generateFakeLabel, generateFakeLog } from "../fakeData";
import {
  isNewUser,
  createUser,
  createFakeUser,
  createFakeLog,
  createFakeLabel,
  createFakeEvent
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
    const userAmount = document.getElementById("fakeUserAmount")?.value;
    const num_users = parseInt(userAmount);

    for (let index = 0; index < num_users; index++) {
      const fakeUser = generateFakeUser();
      const data = {
        given_name: fakeUser.first_name,
        family_name: fakeUser.last_name,
        email: fakeUser.email,
        token: fakeUser.token
      };
      createFakeUser(data);
    }

    //@ts-ignore
    const EventAmount = document.getElementById("fakeEventAmount")?.value;
    const num_events = parseInt(EventAmount);
    for (let index = 0; index < num_events; index++) {
      const fakeEvent = generateFakeEvent()
      createFakeEvent(fakeEvent);
    }

    //@ts-ignore
    const LogAmount = document.getElementById("fakeLogsAmount")?.value;
    const num_logs = parseInt(LogAmount);
    for (let index = 0; index < num_logs; index++) {
      const fakeLog = generateFakeLog();
      createFakeLog(fakeLog);
    }

    //@ts-ignore
    const LabelAmount = document.getElementById("fakeLabelsAmount")?.value;
    const num_labels = parseInt(LabelAmount);
    for (let index = 0; index < num_labels; index++) {
      const fakeLabel = generateFakeLabel();
      createFakeLabel(fakeLabel);
    }

    console.log(`Added ${num_users} users, ${num_events} events, ${num_logs} logs, ${num_labels} labels to the fake DB`)
    alert(`fakes added successfully`);
    
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
      {AppConfig.IS_SHOW_FAKE && 
      (
      <Box id="genFakeContainer"        
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <TextField
            id="fakeUserAmount"
            type="number"
            helperText="Set the amount of fake users to generate"
            label="Num users"
          ></TextField>
           <TextField
            id="fakeEventAmount"
            type="number"
            helperText="Set the amount of fake events to generate"
            label="Num events"
          ></TextField>
            <TextField
            id="fakeLabelsAmount"
            type="number"
            helperText="Set the amount of fake labels to generate"
            label="Num labels"
          ></TextField>
            <TextField
            id="fakeLogsAmount"
            type="number"
            helperText="Set the amount of fake logs to generate"
            label="Num logs"
          ></TextField>
        <Button onClick={(event) => handleGenerateFakeData(event)}>
          {" "}
          Generate Fake Data
        </Button>
      </Box>
      )
      }
    </Box>
  );
};
