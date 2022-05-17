import React from "react";
import "../App.css";
import { Button, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccountCircle } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ButtonGroup from "@mui/material/ButtonGroup";

export const Login: React.FC = () => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [signupOrLogin, setSignupOrLogin] = React.useState<string>("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (signupOrLogin == "Login") {
    }
    if (signupOrLogin == "signup") {
    }
  };

  return (
    <Box
      component="form"
      sx={{
        width: "30%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
      id="loginForm"
      onSubmit={handleSubmit}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <AccountCircle color="info" sx={{ fontSize: 130 }} />
      </Box>

      <TextField
        required
        id="outlined-basic"
        label="Username"
        variant="outlined"
        onChange={handleUsernameChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        required
        id="outlined-basic"
        label="Password"
        variant="outlined"
        type={"password"}
        onChange={handlePasswordChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VpnKeyIcon />
            </InputAdornment>
          ),
        }}
      />
      <ButtonGroup
        size="large"
        variant="text"
        aria-label="text button group"
        sx={{ gap: 1 }}
        fullWidth={true}
      >
        <Button
          type="submit"
          form="loginForm"
          variant="contained"
          onClick={() => setSignupOrLogin("Login")}
        >
          Login
        </Button>
        <Button
          type="submit"
          form="loginForm"
          variant="contained"
          onClick={() => setSignupOrLogin("Signup")}
        >
          Signup
        </Button>
      </ButtonGroup>
    </Box>
  );
};
