import React from "react";
import { Button, Box, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccountCircle } from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Typography from "@mui/material/Typography";
import { addLabel, getLabels, deleteLabelReq } from "../utils/DataAccessLayer";
import { UserObjectContext } from "../App";
import { labelOptions } from "../utils/helper";
import { AppConfig } from "../AppConfig";
import { LabelsList } from "./LabelsList";

export const AddLabel: React.FC = () => {
  const [label, setLabel] = React.useState("");
  const [addLabelValid, setAddLabelValid] = React.useState(true);
  const [removeLabel, setRemoveLabel] = React.useState(-1);
  const [removeLabelValid, setRemoveLabelValid] = React.useState(true);

  const [labelsList, setLabelsList] = React.useState<labelOptions[]>([]);

  // ------------------------------------------------------ Persisted Auth after page refresh for labels Section -----------------------
  //why doing like this?
  //We can only use user object by the useContext hook which is allowed within a React Functional Component
  //Using the setUser from the useState hook resutls in an endless loop so we tackle this by using a different variable with the correct value assigned
  const { user, setUser } = React.useContext(UserObjectContext); //using App's context
  let userFromStorage: any; //option to default back to sessionStorage
  if (JSON.stringify(user) === "{}") {
    const data =
      sessionStorage.getItem(`${AppConfig.sessionStorageContextKey}`) || "";
    userFromStorage = JSON.parse(data);
  } else userFromStorage = user;
  
  setUser(userFromStorage);
  // -------------------------------------------------------------------- End of persisted auth ----------------------------------------------------

  React.useEffect(() => {
    async function callAsync() {
      try {
        const data: labelOptions[] = await getLabels(userFromStorage.token);
        if (data) {
          if (data.length === 0) {
            setLabelsList([]);
            return;
          }
          setLabelsList(
            data.map((labelOption) => {
              return { id: labelOption.id, name: labelOption.name };
            })
          );
        }
      } catch (error:any) {
        console.error(error.message);
        alert("An error accured in server. can't get labels");
        return;
      }
    }
    callAsync();
  }, []);

  const handleAddLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !event.target.value.match(/^[a-z0-9]+/i) ||
      labelsList.map((l) => l.name).find((l) => l == event.target.value)
    )
      setAddLabelValid(false);
    else setAddLabelValid(true);
    setLabel(event.target.value);
  };

  const handleRemoveLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let l = labelsList.find((l) => l.name == event.target.value);
    if (!event.target.value.match(/^[a-z0-9]+/i) || !l)
      setRemoveLabelValid(false);
    else 
      {
        setRemoveLabelValid(true); 
        setRemoveLabel(l.id);
      }
  };

  //to stop refershing the page when adding/removing labels.
  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleAddLabel = async () => {
    if (!addLabelValid) return;
    const response = await addLabel(label, userFromStorage.token)
      .then(() => {
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


  const handleRemoveLabel = async () => {
    if (!removeLabelValid) return;
    const response = await deleteLabelReq(removeLabel, userFromStorage.token)
      .then(() => {
        return getLabels(user.token);
      })
      .catch((err) => {
        console.log("Error! Didn`t remove label");
        throw err;
      });
    setLabelsList(response);
    //@ts-ignore
    document.getElementById("labelToRemoveTxt").value = ""; //clear the feild for better UX
    alert(`${label} removed successfully`);
  };

  return (
    <Box
      className="content-container"
      component="form"
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
              mt: 2,
            }}
          >
            <BookmarkIcon color="primary" sx={{ fontSize: "1000%" }} />
          </Box>
          <Typography
            variant="h2"
            textAlign={"center"}
            gutterBottom
            component="div"
          >
            Configure Label
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "5%",
              gap: 2,
            }}
          >
            <Typography>
              please notice - a new label identical to an existing one will not
              be added!{" "}
            </Typography>
            <TextField
              sx={{ mt: 2 }}
              error={!addLabelValid}
              id="labelToAddTxt"
              label="Label's name to add"
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "5%",
              gap: 2,
            }}
          >
            <TextField
              error={!removeLabelValid}
              id="labelToRemoveTxt"
              label="Label's name to remove"
              variant="outlined"
              onChange={handleRemoveLabelChange}
              helperText={!removeLabelValid ? "Please enter a valid Label " : ""}
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
              color="error"
              onClick={handleRemoveLabel}
            >
              Remove Label
            </Button>
          </Box>
        </Box>
        <Box className="middle-panel"></Box>
        <Box className="right-panel box" sx={{ alignContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <BookmarksIcon color="primary" sx={{ fontSize: "1000%" }} />
          </Box>
          <Typography
            variant="h2"
            textAlign={"center"}
            gutterBottom
            component="div"
          >
            Labels List
          </Typography>
          <LabelsList currentLabelsList={labelsList} />
        </Box>
      </Box>
    </Box>
  );
};
