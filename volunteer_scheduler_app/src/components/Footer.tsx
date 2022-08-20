import React from "react";
import "../App.css";
import { Button, Box, Container, Grid } from "@mui/material";

// Applying focus to tab buttons when pressesd
// not working yet

export const Footer: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={5}>
        <Grid item>
          <Box borderBottom={10}></Box>
        </Grid>
      </Grid>
    </Container>
  );
};
