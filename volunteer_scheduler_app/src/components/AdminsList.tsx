import React, { useEffect, useRef } from "react";
import List from "@mui/material/List";
import { getAdminsList } from "../utils/DataAccessLayer";
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

interface AdminListProps {
  currentAdminList: any;
}

export const AdminsList: React.FC<AdminListProps> = ({ currentAdminList }) => {
  const [admins, setAdmins] = React.useState(currentAdminList);

  const [isPending, setIsPending] = React.useState(true);
  const boxRef = useRef(null);
  const listRef = useRef(null);

  const { user, setUser } = React.useContext(UserObjectContext);

  useEffect(() => {
    if (currentAdminList.length > 0) {
      setAdmins(currentAdminList);
      setIsPending(false);
    }
  }, [currentAdminList]);

  return (
    <Box id="AdminListTabId" ref={boxRef}>
      <List
        id="adminsList"
        ref={listRef}
        style={{ maxHeight: 300, overflow: "auto" }} // - to show more admins on the page w/o scroll
        //style={{ overflow: "auto" }}
      >
        {isPending && <CircularProgress color="primary" size={100} />}
        {admins &&
          //@ts-ignore
          admins.map((adminUser, index) => (
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
                <ListItemText primary={adminUser.email} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
