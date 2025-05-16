import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import NewBoardPopup from "./NewBoardPopup";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";

const StyledButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "#023250",
  "&:hover": {
    backgroundColor: "#01416e",
  },
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const BoardNameWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
});

function Header({
  selectedBoard,
  projects,
  onAddBoard,
  toggleSidebar,
  isSidebarCollapsed,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const BoardNameContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginLeft: isSidebarCollapsed ? "52px" : "226px",
  }));
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleAddBoard = async (...args) => {
    try {
      await onAddBoard(...args);
      handleClosePopup();
    } catch (error) {
      console.error("Error adding board:", error);
      // Optionally, you can show an error message to the user here
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;", }}>
        <BoardNameContainer>
          <IconButton onClick={toggleSidebar}>
            <Menu style={{ color: "#000c19" }} />
          </IconButton>
          <BoardNameWrapper>
            <Typography variant="h6" noWrap component="div" sx={{ color: "#000c19" }}>
              {selectedBoard ? selectedBoard.name : ""}
            </Typography>
          </BoardNameWrapper>
        </BoardNameContainer>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <StyledButton onClick={handleOpenPopup} sx={{ ml: 2 }}>
            Add a Board
          </StyledButton>
        </Box>
      </Toolbar>
      <NewBoardPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        projects={projects}
        onAddBoard={handleAddBoard}
      />
    </AppBar>
  );
}

export default Header;
