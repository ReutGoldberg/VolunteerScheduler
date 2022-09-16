import React from "react";
import { Button, Box, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccountCircle } from "@mui/icons-material";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import { addLabel, getLabels } from "../utils/DataAccessLayer";
import { UserObjectContext } from "../App";
import { labelOptions } from "../utils/helper";
import { AppConfig } from "../AppConfig";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { LabelsList } from "./LabelsList";

export const AddLabel: React.FC = () => {
  const [label, setLabel] = React.useState("");
  const [addLabelValid, setAddLabelValid] = React.useState(true);

  const [labelsList, setLabelsList] = React.useState<labelOptions[]>([]);

  // ------------------------------------------------------ Persisted Auth after page refresh for labels Section -----------------------
  //why doing like this?
  //We can only use user object by the useContext hook which is allowed within a React Functional Component
  //Using the setUser from the useState hook resutls in an endless loop so we tackle this by using a different variable with the correct value assigned
  const { user } = React.useContext(UserObjectContext); //using App's context
  let userFromStorage: any; //option to default back to sessionStorage
  if (JSON.stringify(user) === "{}") {
    const data =
      sessionStorage.getItem(`${AppConfig.sessionStorageContextKey}`) || "";
    userFromStorage = JSON.parse(data);
  } else userFromStorage = user;
  // -------------------------------------------------------------------- End of persisted auth ----------------------------------------------------

  React.useEffect(() => {
    const userToken = userFromStorage.token;
    getLabels(userToken).then((data) => {
      setLabelsList(data);
    });
  }, []);

  const handleAddLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value.match(/^[a-z0-9]+/i)) setAddLabelValid(false);
    else setAddLabelValid(true);
    setLabel(event.target.value);
  };

  //to stop refershing the page when adding/removing labels.
  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleAddLabel = async () => {
    if (!addLabelValid) return;
    const response = await addLabel(label, userFromStorage.token)
      .then(() => {
        console.log("Label added successfully");
        return getLabels(user.token);
      })
      .catch((err) => {
        console.log("Error! Didn`t add label");
        throw err;
      });
    setLabelsList(response);
    //@ts-ignore
    document.getElementById("labelToAddTxt").value = ""; //clear the feild for better UX
    alert(`${label} added successfully`);
  };

  return (
    <Box
      component="form"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
      id="registerForm"
      onSubmit={handleSubmitForm}
    >
      <Box className="row">
        <Box className="left-panel box" sx={{ alignContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ManageAccountsTwoToneIcon
              color="primary"
              sx={{ fontSize: "1000%" }}
            />
          </Box>
          <Typography
            variant="h2"
            textAlign={"center"}
            gutterBottom
            component="div"
          >
            Add Label
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "5%",
              gap: 2,
            }}
          >
            <TextField
              error={!addLabelValid}
              id="labelToAddTxt"
              label="Label"
              variant="outlined"
              onChange={handleAddLabelChange}
              helperText={!addLabelValid ? "Please enter a valid Label " : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              form="registerForm"
              variant="contained"
              onClick={handleAddLabel}
            >
              Add Label
            </Button>
          </Box>
        </Box>
        <Box className="middle-panel"></Box>
        <Box className="right-panel box">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <SupervisorAccountIcon color="primary" sx={{ fontSize: "1000%" }} />
          </Box>
          <Typography
            variant="h2"
            textAlign={"center"}
            gutterBottom
            component="div"
          >
            Labels List
          </Typography>
          <LabelsList curLabelsList={labelsList} />
        </Box>
      </Box>
    </Box>
  );
};
