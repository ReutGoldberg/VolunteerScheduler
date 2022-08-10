import React from "react";
import "../App.css";
import { Button, Box, InputAdornment,TextField } from "@mui/material";
import {generateFakeUser, generateFakeEvent, generateFakeLabel, generateFakeLog} from "../fakeData";

export const Profile: React.FC = () => {
  const fakeUser = generateFakeUser();
  const fakeEvent = generateFakeEvent();
  const fakeLabel  =  generateFakeLabel();
  const fakeLog = generateFakeLog();
  console.log(fakeUser);
  console.log(fakeEvent);
  console.log(fakeLabel);
  console.log(fakeLog);
  return <Box> 
  </Box>;
};
