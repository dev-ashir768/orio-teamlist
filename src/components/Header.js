import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import NewBoardPopup from "./NewBoardPopup";
import AddMemberPopup from "./AddMemberPopup";
import { IconButton, Snackbar } from "@mui/material";
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
  onAddMember,
  toggleSidebar,
  isSidebarCollapsed,
}) {
  const [isBoardPopupOpen, setIsBoardPopupOpen] = useState(false);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  console.log("onAddMember in Header:", onAddMember);

  const BoardNameContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginLeft: isSidebarCollapsed ? "52px" : "226px",
  }));

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
        position="static"
        sx={{
          backgroundColor: "#fff",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
            position: "fixed",
            top: 0,
            width: "100%",
            left: 0,
            right: 0,
            background: "#fff",
          }}
        >
          <BoardNameContainer>
            <IconButton onClick={toggleSidebar}>
              <Menu style={{ color: "#000c19" }} />
            </IconButton>
            <BoardNameWrapper>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: "#000c19" }}
              >
                {selectedBoard ? selectedBoard.name : ""}
              </Typography>
            </BoardNameWrapper>
          </BoardNameContainer>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StyledButton onClick={handleOpenBoardPopup} sx={{ ml: 2 }}>
              Add a Board
            </StyledButton>
            <StyledButton onClick={handleOpenMemberPopup} sx={{ ml: 2 }}>
              Add a Member
            </StyledButton>
          </Box>
        </Toolbar>
      </AppBar>
      <NewBoardPopup
        open={isBoardPopupOpen}
        onClose={handleCloseBoardPopup}
        projects={projects}
        onAddBoard={handleAddBoard}
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
      />
    </>
  );
}

export default Header;


// import React, { useState } from "react";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import { styled } from "@mui/material/styles";
// import NewBoardPopup from "./NewBoardPopup";
// import AddMemberPopup from "./AddMemberPopup";
// import { IconButton } from "@mui/material";
// import { Menu } from "@mui/icons-material";
// import { useData } from '../contexts/DataContext';

// const StyledButton = styled(Button)(({ theme }) => ({
//   color: "#fff",
//   backgroundColor: "#023250",
//   "&:hover": {
//     backgroundColor: "#01416e",
//   },
//   paddingLeft: theme.spacing(3),
//   paddingRight: theme.spacing(3),
// }));

// const BoardNameWrapper = styled(Box)({
//   display: "flex",
//   alignItems: "center",
// });

// function Header({
//   selectedBoard,
//   toggleSidebar,
//   isSidebarCollapsed,
// }) {
//   const { projects, addBoard, addMember } = useData(); // Access context
//   const [isBoardPopupOpen, setIsBoardPopupOpen] = useState(false);
//   const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);

//   const BoardNameContainer = styled(Box)(({ theme }) => ({
//     display: "flex",
//     alignItems: "center",
//     marginLeft: isSidebarCollapsed ? "52px" : "226px",
//   }));

//   const handleOpenBoardPopup = () => {
//     setIsBoardPopupOpen(true);
//   };

//   const handleCloseBoardPopup = () => {
//     setIsBoardPopupOpen(false);
//   };

//   const handleOpenMemberPopup = () => {
//     setIsMemberPopupOpen(true);
//   };

//   const handleCloseMemberPopup = () => {
//     setIsMemberPopupOpen(false);
//   };

//   const handleAddBoard = async (projectId, boardName, boardMembers, newProjectName) => {
//     try {
//       if (newProjectName) {
//         // Handle new project creation if needed (you might need to add this logic to DataProvider)
//         console.log('New project creation not implemented yet');
//       } else {
//         await addBoard(projectId, { name: boardName, members: boardMembers });
//       }
//       handleCloseBoardPopup();
//     } catch (error) {
//       console.error("Error adding board:", error);
//     }
//   };

//   const handleAddMember = async (memberData) => {
//     try {
//       await addMember(memberData); // Use the addMember function from context
//       handleCloseMemberPopup();
//     } catch (error) {
//       console.error("Error adding member:", error);
//     }
//   };

//   return (
//     <AppBar
//       position="static"
//       sx={{
//         backgroundColor: "#fff",
//       }}
//     >
//       <Toolbar
//         sx={{
//           justifyContent: "space-between",
//           boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
//           position: "fixed",
//           top: 0,
//           width: "100%",
//           left: 0,
//           right: 0,
//           background: "#fff",
//         }}
//       >
//         <BoardNameContainer>
//           <IconButton onClick={toggleSidebar}>
//             <Menu style={{ color: "#000c19" }} />
//           </IconButton>
//           <BoardNameWrapper>
//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               sx={{ color: "#000c19" }}
//             >
//               {selectedBoard ? selectedBoard.name : ""}
//             </Typography>
//           </BoardNameWrapper>
//         </BoardNameContainer>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <StyledButton onClick={handleOpenBoardPopup} sx={{ ml: 2 }}>
//             Add a Board
//           </StyledButton>
//           <StyledButton onClick={handleOpenMemberPopup} sx={{ ml: 2 }}>
//             Add a Member
//           </StyledButton>
//         </Box>
//       </Toolbar>
//       <NewBoardPopup
//         open={isBoardPopupOpen}
//         onClose={handleCloseBoardPopup}
//         projects={projects}
//         onAddBoard={handleAddBoard}
//       />
//       <AddMemberPopup
//         open={isMemberPopupOpen}
//         onClose={handleCloseMemberPopup}
//         onAddMember={handleAddMember}
//       />
//     </AppBar>
//   );
// }

// export default Header;