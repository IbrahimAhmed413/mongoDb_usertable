import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useCookies } from "react-cookie";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCookie("user", username, { path: "/" }); // Set cookie when user logs in
    onLogin(username, password);
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        padding: "2rem",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
      </Box>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem",
            borderRadius: "5px",
          }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem",
            borderRadius: "5px",
          }}
        >
          SignUp
        </Button>
      </form>
    </Container>
  );
};

export default Login;
