import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useData } from "../contexts/DataContext";

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "##001E31",
  backgroundImage: "url('/bg-pattern.jpg')",
  backgroundRepeat: "repeat",
  backgroundSize: "auto",
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(5),
  maxWidth: 470,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#fff",
}));

const Logo = styled("img")({
  width: "120px",
  marginBottom: "12px",
});

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { members } = useData();

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = members.find(
      (member) => member.email === email && member.password === password
    );
    user ? onLogin(user) : setError("Invalid email or password");
  };

  return (
    <StyledContainer maxWidth="xl">
      <StyledPaper elevation={8}>
        <Logo src="/logo.svg" alt="Orio Team List" />
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          👋 Welcome Back!
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "#3D3D3D", mt: 1, mb: 2 }}
        >
          Log in to manage your Orio Team List effortlessly
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            autoFocus
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { borderRadius: 12 } }}
          />
          <TextField
            fullWidth
            autoFocus
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { borderRadius: 12 } }}
          />
          {error && (
            <Typography color="error" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: "#0074FC",
              height: 48,
              ":hover": { backgroundColor: "#005DCA" },
            }}
          >
            Login
          </Button>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
}

export default Login;
