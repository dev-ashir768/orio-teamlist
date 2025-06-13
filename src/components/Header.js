import React, { useState } from "react";
import { useData } from "../contexts/DataContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import { styled } from "@mui/material/styles";
import NewBoardPopup from "./NewBoardPopup";
import AddMemberPopup from "./AddMemberPopup";

const StyledButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "#023250",
  "&:hover": {
    backgroundColor: "#01416E",
  },
  padding: theme.spacing(1, 3),
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
}));

const BoardNameWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
  marginLeft: theme.spacing(2),
}));

const BoardNameContainer = styled(Box)(({ theme, isSidebarCollapsed }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: isSidebarCollapsed ? "0px" : "240px",
  transition: theme.transitions.create("margin-left", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  }),
}));

const UserMenuWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  maxWidth: "200px",
}));

function Header({
  selectedBoard,
  projects,
  onAddBoard,
  onAddMember,
  toggleSidebar,
  isSidebarCollapsed,
}) {
  const { currentUser, logout } = useData();
  const [isBoardPopupOpen, setIsBoardPopupOpen] = useState(false);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleOpenBoardPopup = () => {
    setIsBoardPopupOpen(true);
  };

  const handleCloseBoardPopup = () => {
    setIsBoardPopupOpen(false);
  };

  const handleOpenMemberPopup = () => {
    setIsMemberPopupOpen(true);
  };

  const handleCloseMemberPopup = () => {
    setIsMemberPopupOpen(false);
  };

  const handleAddBoard = async (...args) => {
    try {
      if (typeof onAddBoard !== "function") {
        throw new Error("onAddBoard is not a function");
      }
      await onAddBoard(...args);
      setSnackbarMessage("Board added successfully!");
      setSnackbarOpen(true);
      handleCloseBoardPopup();
    } catch (error) {
      console.error("Error adding board:", error);
      setSnackbarMessage(`Failed to add board: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleAddMember = async (memberData) => {
    try {
      if (typeof onAddMember !== "function") {
        throw new Error("onAddMember is not a function");
      }
      await onAddMember(memberData);
      setSnackbarMessage("Member added successfully!");
      setSnackbarOpen(true);
      handleCloseMemberPopup();
    } catch (error) {
      console.error("Error adding member:", error);
      setSnackbarMessage(`Failed to add member: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: "64px",
            px: 3,
          }}
        >
          <BoardNameContainer isSidebarCollapsed={isSidebarCollapsed}>
            <IconButton
              onClick={toggleSidebar}
              edge="start"
              sx={{ color: "#263238" }}
            >
              <MenuIcon />
            </IconButton>
            <BoardNameWrapper>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  color: "#263238",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                }}
              >
                {/* {selectedBoard ? selectedBoard.name : "Orio Teamlist"} */}
                Orio Teamlist
              </Typography>
            </BoardNameWrapper>
          </BoardNameContainer>
          <UserMenuWrapper>
            {currentUser?.right === true && (
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <StyledButton onClick={handleOpenBoardPopup}>
                  Add a Board
                </StyledButton>
                <StyledButton onClick={handleOpenMemberPopup}>
                  Add a Member
                </StyledButton>
              </Box>
            )}
            {currentUser && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={currentUser.imageUrl}
                  alt={currentUser.name}
                  sx={{ width: 40, height: 40 }}
                  style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                />
                <UserInfo>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#263238" }}
                    noWrap
                  >
                    {currentUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {currentUser.email}
                  </Typography>
                </UserInfo>
              </Box>
            )}
          </UserMenuWrapper>
        </Toolbar>
      </AppBar>
      <NewBoardPopup
        open={isBoardPopupOpen}
        onClose={handleCloseBoardPopup}
        projects={projects}
        onAddBoard={handleAddBoard}
        currentUser={currentUser}
      />
      <AddMemberPopup
        open={isMemberPopupOpen}
        onClose={handleCloseMemberPopup}
        onAddMember={handleAddMember}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: snackbarMessage.includes("Failed")
              ? "#d32f2f"
              : "#388e3c",
          },
        }}
      />
    </>
  );
}

export default Header;
