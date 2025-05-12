import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import NewBoardPopup from "./NewBoardPopup";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  padding: theme.spacing(1),
}));

const BoardNameContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "240px",
  minWidth: "200px",
  maxWidth: "400px",
}));

const BoardNameWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

//////

function Header({
  selectedBoard,
  projects,
  onAddBoard,
  user,
  onUpdateBoardName,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBoardName, setEditedBoardName] = useState(
    selectedBoard ? selectedBoard.name : ""
  );

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedBoardName(selectedBoard ? selectedBoard.name : "");
  };

  const handleSaveClick = () => {
    if (editedBoardName.trim() !== "" && selectedBoard) {
      onUpdateBoardName(selectedBoard.id, editedBoardName.trim());
      setIsEditing(false);
    }
  };

  const handleBoardNameChange = (event) => {
    setEditedBoardName(event.target.value);
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
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <BoardNameContainer>
          {isEditing ? (
            <BoardNameWrapper>
              <InputBase
                sx={{
                  color: "inherit",
                  fontSize: "h6.fontSize",
                  flexGrow: 1,
                }}
                value={editedBoardName}
                onChange={handleBoardNameChange}
                autoFocus
                onBlur={handleSaveClick}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveClick();
                  }
                }}
              />
              <IconButton
                color="inherit"
                onClick={handleSaveClick}
                size="small"
              >
                <SaveIcon />
              </IconButton>
            </BoardNameWrapper>
          ) : (
            <BoardNameWrapper>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  flexGrow: 1,
                  marginRight: 1,
                }}
              >
                {selectedBoard ? selectedBoard.name : ""}
              </Typography>
              {selectedBoard && (
                <IconButton
                  color="inherit"
                  onClick={handleEditClick}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              )}
            </BoardNameWrapper>
          )}
        </BoardNameContainer>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
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
