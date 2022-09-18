import React from "react";
import { Button, Box, TextField } from "@mui/material";
import {
    generateFakeUser,
    generateFakeEvent,
    generateFakeLabel,
    generateFakeLog,
  } from "../fakeData";

  import {
    createFakeUser,
    createFakeLog,
    createFakeLabel,
    createFakeEvent,
    createFakeEnrollToEvent
  } from "../utils/DataAccessLayer";

  async function handleGenerateFakeData(event: any) {
    //@ts-ignore
    const userAmount = document.getElementById("fakeUserAmount")?.value;
    const num_users = parseInt(userAmount);

    //@ts-ignore
    const EnrollslAmount = document.getElementById("fakeEnrollsAmount")?.value;
    const num_enrolls = parseInt(EnrollslAmount);

    //@ts-ignore
    const EventAmount = document.getElementById("fakeEventAmount")?.value;
    const num_events = parseInt(EventAmount);

    if(num_enrolls > num_events*num_users){ //check
      console.error("Not enought combinations to enroll users");
      return;                  
    }

    for (let index = 0; index < num_users; index++) {
      const fakeUser = generateFakeUser();
      const data = {
        given_name: fakeUser.first_name,
        family_name: fakeUser.last_name,
        email: fakeUser.email,
        token: fakeUser.token,
        is_admin: fakeUser.is_admin,
      };
      createFakeUser(data);
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

    //Events part
    for (let index = 0; index < num_events; index++) {
      const fakeEvent = generateFakeEvent();
      createFakeEvent(fakeEvent);
    }

    //Enrolls part:
    createFakeEnrollToEvent(num_enrolls);

    console.log(`Added ${num_users} users, ${num_events} events, ${num_logs} logs, ${num_labels} labels to the fake DB`)
    console.log(`And enrolled ${num_enrolls}`);
    alert(`fakes added successfully`);
  }



export const FakeDataGen: React.FC = () => {

    return <Box
        id="genFakeContainer"
        sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        }}
    >
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
        <TextField
        id="fakeEnrollsAmount"
        type="number"
        helperText="Set the amount of enrolls to generate"
        label="Num Enrolls"
        ></TextField>
        <Button onClick={(event) => handleGenerateFakeData(event)}>
            {" "}
            Generate Fake Data
        </Button>
    </Box>
};


