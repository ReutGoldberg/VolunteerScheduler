import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { UserObjectContext } from "../App";
import { isUserExists } from "../utils/helper";

export default function ButtonAppBar() {
  const { user, setUser } = React.useContext(UserObjectContext);

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          flexGrow: 1,
          backgroundColor: "rgb(199, 245, 224)",
          height: 100,
          border: "none",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              mr: 2,
              display: { xs: "flex" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 60,
            }}
          >
            Volunteer Scheduler
          </Typography>
          {isUserExists() && (
            <Box
              sx={{
                mr: 2,
                marginTop: 1,
              }}
            >
              <Typography>{user.name}</Typography>
            </Box>
          )}
          {isUserExists() && (
            <Box
              sx={{
                mr: 2,
                marginTop: 1,
              }}
            >
              {" "}
              <img width={80} height={80} src={user.picture}></img>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
