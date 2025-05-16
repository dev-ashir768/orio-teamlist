// import React, { useState, useCallback } from "react";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemText,
//   Collapse,
//   IconButton,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   CircularProgress,
//   Link,
// } from "@mui/material";
// import {
//   ExpandLess,
//   ExpandMore,
//   Menu as MenuIcon,
//   Delete as DeleteIcon,
//   DeleteOutlineOutlined,
//   ScheduleOutlined,
//   TryOutlined,
//   FolderOutlined,
//   LogoutOutlined,
//   Home,
//   HomeOutlined,
// } from "@mui/icons-material";
// import { useData } from "../contexts/DataContext";

// const drawerWidth = 240;
// const collapsedWidth = 60;

// function Sidebar({
//   selectProject,
//   selectBoard,
//   selectedProject,
//   selectedBoard,
//   onDeleteProject,
//   onDeleteBoard,
//   onLogout,
//   isSidebarCollapsed,
// }) {
//   const { getUserProjects, getUserBoards } = useData();
//   const [openSection, setOpenSection] = useState("dashboard");
//   const [openProjects, setOpenProjects] = useState({});

//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   const userProjects = getUserProjects();
//   const userBoards = getUserBoards();

//   const handleSectionClick = useCallback((section) => {
//     setOpenSection((prevSection) => (prevSection === section ? "" : section));
//   }, []);

//   const handleProjectClick = useCallback(
//     (projectId) => {
//       setOpenProjects((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
//       selectProject(projectId);
//     },
//     [selectProject]
//   );

//   const handleDeleteClick = useCallback((item, type) => {
//     setItemToDelete({ item, type });
//     setDeleteConfirmOpen(true);
//   }, []);

//   const handleDeleteConfirm = useCallback(() => {
//     if (itemToDelete?.type === "project") {
//       onDeleteProject(itemToDelete.item.id);
//     } else if (itemToDelete?.type === "board") {
//       onDeleteBoard(itemToDelete.item.id);
//     }
//     setDeleteConfirmOpen(false);
//     setItemToDelete(null);
//   }, [itemToDelete, onDeleteProject, onDeleteBoard]);

//   const renderProjectList = useCallback(
//     (projectList) => {
//       if (!projectList || projectList.length === 0) {
//         return (
//           <Typography variant="body2" sx={{ pl: 4 }}>
//             No projects available
//           </Typography>
//         );
//       }

//       return (
//         <>
//           {projectList.map((project) => (
//             <React.Fragment key={project.id}>
//               <ListItemButton
//                 sx={{
//                   borderRadius: "10px",
//                   backgroundColor:
//                     selectedProject && selectedProject.id === project.id
//                       ? "#023250"
//                       : "transparent",
//                 }}
//                 onClick={() => handleProjectClick(project.id)}
//               >
//                 <ListItemText
//                   primary={
//                     typeof project.name === "string"
//                       ? `${project.name}`
//                       : "Unnamed Project"
//                   }
//                 />
//                 <IconButton
//                   edge="end"
//                   aria-label="delete"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteClick(project, "project");
//                   }}
//                 >
//                   <DeleteOutlineOutlined
//                     style={{
//                       width: "22px",
//                       height: "22px",
//                       color: "#fff",
//                     }}
//                   />
//                 </IconButton>
//                 {openProjects[project.id] ? (
//                   <ExpandLess sx={{ ml: 2 }} />
//                 ) : (
//                   <ExpandMore sx={{ ml: 2 }} />
//                 )}
//               </ListItemButton>
//               <Collapse
//                 in={openProjects[project.id]}
//                 timeout="auto"
//                 unmountOnExit
//               >
//                 <List component="div" disablePadding>
//                   {userBoards
//                     .filter((board) => board.projectId === project.id)
//                     .map((board) => (
//                       <ListItemButton
//                         sx={{ pl: 4, pr: 6 }}
//                         key={board.id}
//                         selected={
//                           selectedBoard && selectedBoard.id === board.id
//                         }
//                         onClick={() => selectBoard(board.id)}
//                       >
//                         <ListItemText
//                           primary={
//                             typeof board.name === "string"
//                               ? board.name
//                               : "Unnamed Board"
//                           }
//                         />
//                         <IconButton
//                           edge="end"
//                           aria-label="delete"
//                           sx={{ p: 0 }}
//                           style={{ marginRight: "4px" }}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeleteClick(board, "board");
//                           }}
//                         >
//                           <DeleteOutlineOutlined
//                             style={{
//                               width: "22px",
//                               height: "22px",
//                               color: "#fff",
//                             }}
//                           />
//                         </IconButton>
//                       </ListItemButton>
//                     ))}
//                 </List>
//               </Collapse>
//             </React.Fragment>
//           ))}
//         </>
//       );
//     },
//     [
//       userBoards,
//       selectedProject,
//       selectedBoard,
//       handleProjectClick,
//       selectBoard,
//       handleDeleteClick,
//       openProjects,
//     ]
//   );

//   if (!userProjects) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100%",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Drawer
//         sx={{
//           width: isSidebarCollapsed ? collapsedWidth : drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: isSidebarCollapsed ? collapsedWidth : drawerWidth,
//             boxSizing: "border-box",
//             transition: "width 0.2s",
//             overflowX: "hidden",
//           },
//         }}
//         variant="permanent"
//         anchor="left"
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: 1,
//             minHeight: 64,
//             backgroundColor: "#000c19",
//             borderBottom: "1px solid #1b506f",
//           }}
//         >
//           {!isSidebarCollapsed && (
//             <Box
//               sx={{ flexGrow: 1, ml: 1, display: "flex", alignItems: "center" }}
//             >
//               <img
//                 src="/logo-white.svg"
//                 alt="Teamlist"
//                 style={{
//                   maxHeight: "40px",
//                   maxWidth: "100%",
//                   marginInline: "auto",
//                 }}
//               />
//             </Box>
//           )}
//         </Box>
//         {!isSidebarCollapsed && (
//           <>
//             <List
//               sx={{
//                 backgroundColor: "#000c19",
//                 height: "100%",
//                 color: "#fff",
//                 px: 1,
//               }}
//             >

//               <ListItemButton
//                 sx={{
//                   mb: 1,
//                   borderRadius: "10px",
//                   backgroundColor:
//                     openSection === "dashboard" ? "#023250" : "transparent",
//                   "&:hover": {
//                     backgroundColor: "#023250",
//                   },
//                 }}
//                 onClick={() => handleSectionClick("projects")}
//               >
//                 <HomeOutlined
//                   sx={{ mr: 1.5, color: "#fff", width: "22px", height: "22px" }}
//                 />
//                 <ListItemText primary="Dashboard" />
//               </ListItemButton>

//               <ListItemButton
//                 sx={{
//                   mb: 1,
//                   borderRadius: "10px",
//                   backgroundColor:
//                     openSection === "projects" ? "#023250" : "transparent",
//                   "&:hover": {
//                     backgroundColor: "#023250",
//                   },
//                 }}
//                 onClick={() => handleSectionClick("projects")}
//               >
//                 <FolderOutlined
//                   sx={{ mr: 1.5, color: "#fff", width: "22px", height: "22px" }}
//                 />
//                 <ListItemText primary="Projects" />
//                 {openSection === "projects" ? (
//                   <ExpandLess sx={{ ml: 2 }} />
//                 ) : (
//                   <ExpandMore sx={{ ml: 2 }} />
//                 )}
//               </ListItemButton>
//               <Collapse
//                 in={openSection === "projects"}
//                 timeout="auto"
//                 unmountOnExit
//               >
//                 <List component="div" disablePadding>
//                   {renderProjectList(userProjects)}
//                 </List>
//               </Collapse>
//             </List>

//             <Box
//               sx={{
//                 p: 2,
//                 backgroundColor: "#000c19",
//                 borderTop: "1px solid #1b506f",
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <div style={{ textAlign: "center" }}>
//                 <Button
//                   startIcon={<LogoutOutlined />}
//                   onClick={onLogout}
//                   sx={{
//                     backgroundColor: "#023250",
//                     color: "#fff",
//                     borderRadius: "10px",
//                     textTransform: "none",
//                     py: 1.2,
//                     width: "130px",
//                     "&:hover": {
//                       backgroundColor: "#01416e",
//                     },
//                   }}
//                 >
//                   Log Out
//                 </Button>
//                 <Typography color={"#fff"} mt={1}>
//                   Copyright © {new Date().getFullYear()}{" "}
//                   <Link
//                     href="https://getorio.com/"
//                     target="_blank"
//                     color={"#0074fc"}
//                   >
//                     ORIO
//                   </Link>
//                 </Typography>
//               </div>
//             </Box>
//           </>
//         )}
//       </Drawer>
//       <Dialog
//         open={deleteConfirmOpen}
//         onClose={() => setDeleteConfirmOpen(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
//         <DialogContent>
//           <Typography id="alert-dialog-description">
//             Are you sure you want to delete this {itemToDelete?.type}? This
//             action cannot be undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
//           <Button onClick={handleDeleteConfirm} autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

// export default Sidebar;

import React, { useState, useCallback } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Link,
} from "@mui/material";
import {
  FolderOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@mui/icons-material";
import { useData } from "../contexts/DataContext";

const drawerWidth = 240;
const collapsedWidth = 60;

function Sidebar({
  onLogout,
  isSidebarCollapsed,
  onSectionChange,
}) {
  const { getUserProjects } = useData();
  const [openSection, setOpenSection] = useState("dashboard");

  const userProjects = getUserProjects();

  const handleSectionClick = useCallback(
    (section) => {
      setOpenSection(section);
      onSectionChange(section);
    },
    [onSectionChange]
  );

  if (!userProjects) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Drawer
        sx={{
          width: isSidebarCollapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSidebarCollapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            transition: "width 0.2s",
            overflowX: "hidden",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            minHeight: 64,
            backgroundColor: "#000c19",
            borderBottom: "1px solid #1b506f",
          }}
        >
          {!isSidebarCollapsed && (
            <Box
              sx={{ flexGrow: 1, ml: 1, display: "flex", alignItems: "center" }}
            >
              <img
                src="/logo-white.svg"
                alt="Teamlist"
                style={{
                  maxHeight: "40px",
                  maxWidth: "100%",
                  marginInline: "auto",
                }}
              />
            </Box>
          )}
        </Box>
        {!isSidebarCollapsed && (
          <>
            <List
              sx={{
                backgroundColor: "#000c19",
                height: "100%",
                color: "#fff",
                px: 1,
              }}
            >
              <ListItemButton
                sx={{
                  mb: 1,
                  borderRadius: "10px",
                  backgroundColor:
                    openSection === "dashboard" ? "#023250" : "transparent",
                  "&:hover": {
                    backgroundColor: "#023250",
                  },
                }}
                onClick={() => handleSectionClick("dashboard")}
              >
                <HomeOutlined
                  sx={{ mr: 1.5, color: "#fff", width: "22px", height: "22px" }}
                />
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              <ListItemButton
                sx={{
                  mb: 1,
                  borderRadius: "10px",
                  backgroundColor:
                    openSection === "projects" ? "#023250" : "transparent",
                  "&:hover": {
                    backgroundColor: "#023250",
                  },
                }}
                onClick={() => handleSectionClick("projects")}
              >
                <FolderOutlined
                  sx={{ mr: 1.5, color: "#fff", width: "22px", height: "22px" }}
                />
                <ListItemText primary="Projects" />
              </ListItemButton>
            </List>

            <Box
              sx={{
                p: 2,
                backgroundColor: "#000c19",
                borderTop: "1px solid #1b506f",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Button
                  startIcon={<LogoutOutlined />}
                  onClick={onLogout}
                  sx={{
                    backgroundColor: "#023250",
                    color: "#fff",
                    borderRadius: "10px",
                    textTransform: "none",
                    py: 1.2,
                    width: "130px",
                    "&:hover": {
                      backgroundColor: "#01416e",
                    },
                  }}
                >
                  Log Out
                </Button>
                <Typography color={"#fff"} mt={1}>
                  Copyright © {new Date().getFullYear()}{" "}
                  <Link
                    href="https://getorio.com/"
                    target="_blank"
                    color={"#0074fc"}
                  >
                    ORIO
                  </Link>
                </Typography>
              </div>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
}

export default Sidebar;
