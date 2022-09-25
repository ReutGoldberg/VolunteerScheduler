import React, { useEffect, useRef } from "react";
import List from "@mui/material/List";
import { getLabels } from "../utils/DataAccessLayer";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";
import { labelOptions } from "../utils/helper";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { UserObjectContext } from "../App";
import { AppConfig } from "../AppConfig";
import { SettingsSuggestRounded } from "@mui/icons-material";

interface LabelsListProps {
  currentLabelsList: labelOptions[];
}

export const LabelsList: React.FC<LabelsListProps> = ({
  currentLabelsList,
}) => {
  const [labels, setLabels] = React.useState(currentLabelsList);

  const [isPending, setIsPending] = React.useState(true);
  const boxRef = useRef(null);
  const listRef = useRef(null);

  const { user, setUser } = React.useContext(UserObjectContext); //using App's context
  let userFromStorage: any; //option to default back to sessionStorage
  if (JSON.stringify(user) === "{}") {
    const data =
      sessionStorage.getItem(`${AppConfig.sessionStorageContextKey}`) || "";
    userFromStorage = JSON.parse(data);
  } else userFromStorage = user;
  

  //========
  if (JSON.stringify(userFromStorage) === "{}") {
    userFromStorage = JSON.parse(
      window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || ""
    );
    setUser(userFromStorage); //updating the context
  }
  //final safe-check for the user value
  if (userFromStorage === "") {
    const msg: string = `userObject is not set, can't reterive data from DB`;
    console.error(msg);
    throw new Error(msg);
  }
  
  // -------------------------------------------------------------------- End of persisted auth ----------------------------------------------------
  React.useEffect(() => {
    const userToken = userFromStorage.token;
    getLabels(userToken).then((data) => {
      setLabels(data);
      setIsPending(false);
    })
  }, []);


  useEffect(() => {
    if (currentLabelsList.length > 0) {
      setLabels(currentLabelsList);
      setIsPending(false);
    }
  }, [currentLabelsList]);

  return (
    <Box id="LabelsListTabId" ref={boxRef}>
      <List
        id="labelsList"
        ref={listRef}
        style={{ maxHeight: 350, overflow: "auto" }}
      >
        {isPending && <CircularProgress color="primary" size={100} />}
        {labels &&
          labels.map((label, index) => (
            <ListItem
              disablePadding
              key={index}
              sx={{
                display: "inline",
                fontSize: 17,
                fontWeight: "bold",
                gap: 3,
                paddingTop: 1,
                paddingBottom: 1,
              }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar variant="rounded">
                    <BookmarkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={label.name} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

