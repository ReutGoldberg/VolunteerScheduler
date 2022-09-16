import React, { useEffect, useRef } from "react";
import List from "@mui/material/List";
import { getLabels } from "../utils/DataAccessLayer";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { AccountCircle } from "@mui/icons-material";
import Box from "@mui/material/Box";
import { UserObjectContext } from "../App";
import { AppConfig } from "../AppConfig";

interface LabelsListProps {
  curLabelsList: any;
}

export const LabelsList: React.FC<LabelsListProps> = ({ curLabelsList }) => {
  console.log(
    `This is the prop value of labels list: ${JSON.stringify(curLabelsList)}`
  );

  const [labels, setLabels] = React.useState(curLabelsList);

  const [isPending, setIsPending] = React.useState(true);
  const boxRef = useRef(null);
  const listRef = useRef(null);

  const { user, setUser } = React.useContext(UserObjectContext);

  //set labels list one on initial load
  useEffect(() => {
    let userObj = user;
    //if we get an empty object upon rendering the component - grab the user context from sessionStorage, where it's already set.
    if (JSON.stringify(userObj) === "{}") {
      userObj = JSON.parse(
        window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || ""
      );
      setUser(userObj); //updating the context
    }
    //final safe-check for the user value
    if (userObj === "") {
      const msg: string = `userObject is not set, can't reterive data from DB`;
      console.error(msg);
      throw new Error(msg);
    }
    getLabels(userObj.token).then((data) => {
      console.log(data);
      setLabels(data);
      setIsPending(false);
    });
  }, []);

  useEffect(() => {
    if (curLabelsList.length > 0) {
      setLabels(curLabelsList);
      setIsPending(false);
    }
  }, [curLabelsList]);

  return (
    <Box id="LabelsListTabId" ref={boxRef}>
      <List id="labelsList" ref={listRef} style={{ overflow: "auto" }}>
        {isPending && <CircularProgress color="primary" size={100} />}
        {labels &&
          //@ts-ignore
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
                    <AccountCircle />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
