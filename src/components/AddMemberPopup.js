import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

function AddMemberPopup({ open, onClose, onAddMember }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Default imageUrl URL (not visible in UI)
  const defaultImageUrl =
    "https://www.pngkey.com/png/full/73-730434_04-dummy-avatar.png";

  const handleSubmit = async () => {
    setError("");

    // Form validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await onAddMember({
        name,
        email,
        password,
        imageUrl: defaultImageUrl,
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error adding member:", error);
      setError("Failed to add member. Please try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setPassword("");
    setEmail("");
    setError("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pt: "18px", pb: "0px" }}>Add New Member</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            type="email"
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            type="password"
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: "24px" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddMemberPopup;
