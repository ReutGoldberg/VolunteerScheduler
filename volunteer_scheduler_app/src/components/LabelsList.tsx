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
        style={{ maxHeight: 300, overflow: "auto" }}
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
