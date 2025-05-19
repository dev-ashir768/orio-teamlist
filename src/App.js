// // import React, { useState, useCallback } from "react";
// // import { ThemeProvider, createTheme } from "@mui/material/styles";
// // import CssBaseline from "@mui/material/CssBaseline";
// // import Box from "@mui/material/Box";
// // import Typography from "@mui/material/Typography";
// // import { DragDropContext } from "react-beautiful-dnd";
// // import Sidebar from "./components/Sidebar";
// // import Header from "./components/Header";
// // import Board from "./components/Board";
// // import Login from "./components/Login";
// // import { DataProvider, useData } from "./contexts/DataContext";

// // const theme = createTheme({
// //   palette: {
// //     primary: {
// //       main: "#182600",
// //     },
// //     secondary: {
// //       main: "#f50057",
// //     },
// //     background: {
// //       default: "#f5f5f5",
// //     },
// //   },
// //   typography: {
// //     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
// //     h1: {
// //       fontSize: "2.5rem",
// //       fontWeight: 500,
// //     },
// //     h2: {
// //       fontSize: "2rem",
// //       fontWeight: 500,
// //     },
// //     body1: {
// //       fontSize: "0.8rem",
// //       lineHeight: 1.5,
// //     },
// //   },
// //   shape: {
// //     borderRadius: 6,
// //   },
// //   components: {
// //     MuiButton: {
// //       styleOverrides: {
// //         root: {
// //           textTransform: "none",
// //         },
// //       },
// //     },
// //     MuiCard: {
// //       styleOverrides: {
// //         root: {
// //           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
// //         },
// //       },
// //     },
// //   },
// // });

// // function App() {
// //   return (
// //     <DataProvider>
// //       <ThemeProvider theme={theme}>
// //         <CssBaseline />
// //         <AppContent />
// //       </ThemeProvider>
// //     </DataProvider>
// //   );
// // }

// // function AppContent() {
// //   const {
// //     currentUser,
// //     login,
// //     logout,
// //     getUserProjects,
// //     getUserBoards,
// //     getUserColumns,
// //     getUserTasks,
// //     addProject,
// //     deleteProject,
// //     addBoard,
// //     updateBoard,
// //     deleteBoard,
// //     addColumn,
// //     updateColumn,
// //     deleteColumn,
// //     addTask,
// //     updateTask,
// //     deleteTask,
// //     moveTask,
// //     members,
// //     labels,
// //   } = useData();

// //   const [selectedProjectId, setSelectedProjectId] = useState(null);
// //   const [selectedBoardId, setSelectedBoardId] = useState(null);
// //   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

// //   const userProjects = getUserProjects();
// //   const userBoards = getUserBoards();
// //   const userColumns = getUserColumns();
// //   const userTasks = getUserTasks();

// //   const selectedProject = userProjects.find((p) => p.id === selectedProjectId);
// //   const selectedBoard = userBoards.find((b) => b.id === selectedBoardId);

// //   const selectProject = useCallback((projectId) => {
// //     setSelectedProjectId(projectId);
// //     setSelectedBoardId(null);
// //   }, []);

// //   const selectBoard = useCallback(
// //     (boardId) => {
// //       const board = userBoards.find((b) => b.id === boardId);
// //       if (board) {
// //         setSelectedProjectId(board.projectId);
// //         setSelectedBoardId(boardId);
// //       }
// //     },
// //     [userBoards]
// //   );

// //   const handleSaveBoard = useCallback(
// //     (updatedBoard) => {
// //       updateBoard(updatedBoard.id, updatedBoard);
// //     },
// //     [updateBoard]
// //   );

// //   const onDragEnd = useCallback(
// //     (result) => {
// //       const { source, destination, draggableId, type } = result;

// //       if (!destination) {
// //         return;
// //       }

// //       if (
// //         source.droppableId === destination.droppableId &&
// //         source.index === destination.index
// //       ) {
// //         return;
// //       }

// //       if (type === "COLUMN") {
// //         // Handle column reordering here if needed
// //         return;
// //       }

// //       moveTask(
// //         draggableId,
// //         source.droppableId,
// //         destination.droppableId,
// //         destination.index
// //       );
// //     },
// //     [moveTask]
// //   );

// //   const handleAddBoard = useCallback(
// //     async (projectId, boardName, boardMembers, newProjectName = null) => {
// //       try {
// //         let targetProjectId = projectId;

// //         if (newProjectName) {
// //           const newProject = {
// //             name: newProjectName,
// //             members: boardMembers,
// //           };
// //           const addedProject = await addProject(newProject);
// //           targetProjectId = addedProject.id;
// //         }

// //         const newBoard = {
// //           name: boardName,
// //           projectId: targetProjectId,
// //           members: boardMembers,
// //         };
// //         const addedBoard = await addBoard(targetProjectId, newBoard);

// //         const defaultColumns = [
// //           { title: "To Do", boardId: addedBoard.id },
// //           { title: "In Progress", boardId: addedBoard.id },
// //           { title: "Done", boardId: addedBoard.id },
// //         ];

// //         for (const column of defaultColumns) {
// //           await addColumn(addedBoard.id, column);
// //         }

// //         selectBoard(addedBoard.id);
// //       } catch (error) {
// //         console.error("Error creating new board:", error);
// //       }
// //     },
// //     [addProject, addBoard, addColumn, selectBoard]
// //   );

// //   const toggleSidebar = useCallback(() => {
// //     setIsSidebarCollapsed((prev) => !prev);
// //   }, []);

// //   const handleUpdateBoardName = useCallback(
// //     (boardId, newName) => {
// //       updateBoard(boardId, { name: newName });
// //     },
// //     [updateBoard]
// //   );

// //   const handleDeleteProject = useCallback(
// //     (projectId) => {
// //       deleteProject(projectId);
// //       if (selectedProjectId === projectId) {
// //         setSelectedProjectId(null);
// //         setSelectedBoardId(null);
// //       }
// //     },
// //     [deleteProject, selectedProjectId]
// //   );

// //   const handleDeleteBoard = useCallback(
// //     (boardId) => {
// //       deleteBoard(boardId);
// //       if (selectedBoardId === boardId) {
// //         setSelectedBoardId(null);
// //       }
// //     },
// //     [deleteBoard, selectedBoardId]
// //   );

// //   const handleAddColumn = useCallback(
// //     (boardId, newColumn) => {
// //       addColumn(boardId, newColumn);
// //     },
// //     [addColumn]
// //   );

// //   const handleUpdateColumn = useCallback(
// //     (columnId, updatedData) => {
// //       updateColumn(columnId, updatedData);
// //     },
// //     [updateColumn]
// //   );

// //   const handleDeleteColumn = useCallback(
// //     (columnId) => {
// //       deleteColumn(columnId);
// //     },
// //     [deleteColumn]
// //   );

// //   const handleLogin = useCallback(
// //     (loggedInUser) => {
// //       login(loggedInUser);
// //       setSelectedProjectId(null);
// //       setSelectedBoardId(null);
// //     },
// //     [login]
// //   );

// //   const handleLogout = useCallback(() => {
// //     logout();
// //     setSelectedProjectId(null);
// //     setSelectedBoardId(null);
// //   }, [logout]);

// //   if (!currentUser) {
// //     return <Login onLogin={handleLogin} />;
// //   }
// //   return (
// //     <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
// //       <Header
// //         selectedBoard={selectedBoard}
// //         projects={userProjects}
// //         onAddBoard={handleAddBoard}
// //         onLogout={handleLogout}
// //         user={currentUser}
// //         onUpdateBoardName={handleUpdateBoardName}
// //         toggleSidebar={toggleSidebar}
// //         isSidebarCollapsed={isSidebarCollapsed}
// //       />
// //       <Box sx={{ display: "flex", flexGrow: 1 }}>
// //         <Sidebar
// //           isSidebarCollapsed={isSidebarCollapsed}
// //           projects={userProjects}
// //           boards={userBoards}
// //           selectProject={selectProject}
// //           selectBoard={selectBoard}
// //           selectedProject={selectedProject}
// //           selectedBoard={selectedBoard}
// //           onDeleteProject={handleDeleteProject}
// //           onDeleteBoard={handleDeleteBoard}
// //           onLogout={handleLogout}
// //         />
// //         <Box
// //           component="main"
// //           sx={{
// //             flexGrow: 1,
// //             display: "flex",
// //             flexDirection: "column",
// //             backgroundImage: "url(https://teamlist.team/images/innerbg.jpg)",
// //             backgroundSize: "cover",
// //             backgroundPosition: "center",
// //             backgroundRepeat: "no-repeat",
// //             backgroundBlendMode: "overlay",
// //             overflowY: "auto",
// //             p: 2,
// //           }}
// //         >
// //           <DragDropContext onDragEnd={onDragEnd}>
// //             {selectedBoard ? (
// //               <>
// //                 <Board
// //                   key={`${selectedBoard.id}-${Date.now()}`}
// //                   board={selectedBoard}
// //                   columns={userColumns.filter(
// //                     (c) => c.boardId === selectedBoard.id
// //                   )}
// //                   tasks={userTasks.filter(
// //                     (t) => t.boardId === selectedBoard.id
// //                   )}
// //                   onSaveBoard={handleSaveBoard}
// //                   boardMembers={members.filter((m) =>
// //                     selectedBoard.members.includes(m.id)
// //                   )}
// //                   availableLabels={labels}
// //                   onAddTask={addTask}
// //                   onUpdateTask={updateTask}
// //                   onDeleteTask={deleteTask}
// //                   onAddColumn={handleAddColumn}
// //                   onUpdateColumn={handleUpdateColumn}
// //                   onDeleteColumn={handleDeleteColumn}
// //                 />
// //               </>
// //             ) : (
// //               <Box
// //                 sx={{
// //                   display: "flex",
// //                   justifyContent: "center",
// //                   alignItems: "center",
// //                   height: "100%",
// //                 }}
// //               >
// //                 <Typography
// //                   variant="h6"
// //                   align="center"
// //                   sx={{ color: "text.secondary" }}
// //                 >
// //                   Please select a project board to use Teamlist
// //                 </Typography>
// //               </Box>
// //             )}
// //           </DragDropContext>
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // }

// // export default App;

// // import React, { useState, useCallback } from "react";
// // import { ThemeProvider, createTheme } from "@mui/material/styles";
// // import CssBaseline from "@mui/material/CssBaseline";
// // import Box from "@mui/material/Box";
// // import Typography from "@mui/material/Typography";
// // import Button from "@mui/material/Button";
// // import Card from "@mui/material/Card";
// // import CardContent from "@mui/material/CardContent";
// // import { DragDropContext } from "react-beautiful-dnd";
// // import Sidebar from "./components/Sidebar";
// // import Header from "./components/Header";
// // import Board from "./components/Board";
// // import Login from "./components/Login";
// // import { DataProvider, useData } from "./contexts/DataContext";
// // import { ArrowBack, DeleteOutlineOutlined } from "@mui/icons-material";
// // import { IconButton } from "@mui/material";

// // const theme = createTheme({
// //   palette: {
// //     primary: {
// //       main: "#182600",
// //     },
// //     secondary: {
// //       main: "#f50057",
// //     },
// //     background: {
// //       default: "#f5f5f5",
// //     },
// //   },
// //   typography: {
// //     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
// //     h1: {
// //       fontSize: "2.5rem",
// //       fontWeight: 500,
// //     },
// //     h2: {
// //       fontSize: "2rem",
// //       fontWeight: 500,
// //     },
// //     body1: {
// //       fontSize: "0.8rem",
// //       lineHeight: 1.5,
// //     },
// //   },
// //   shape: {
// //     borderRadius: 6,
// //   },
// //   components: {
// //     MuiButton: {
// //       styleOverrides: {
// //         root: {
// //           textTransform: "none",
// //         },
// //       },
// //     },
// //     MuiCard: {
// //       styleOverrides: {
// //         root: {
// //           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
// //         },
// //       },
// //     },
// //   },
// // });

// // function App() {
// //   return (
// //     <DataProvider>
// //       <ThemeProvider theme={theme}>
// //         <CssBaseline />
// //         <AppContent />
// //       </ThemeProvider>
// //     </DataProvider>
// //   );
// // }

// // function AppContent() {
// //   const {
// //     currentUser,
// //     login,
// //     logout,
// //     getUserProjects,
// //     getUserBoards,
// //     getUserColumns,
// //     getUserTasks,
// //     addProject,
// //     deleteProject,
// //     addBoard,
// //     updateBoard,
// //     deleteBoard,
// //     addColumn,
// //     updateColumn,
// //     deleteColumn,
// //     addTask,
// //     updateTask,
// //     deleteTask,
// //     moveTask,
// //     members,
// //     labels,
// //   } = useData();

// //   const [selectedProjectId, setSelectedProjectId] = useState(null);
// //   const [selectedBoardId, setSelectedBoardId] = useState(null);
// //   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
// //   const [activeSection, setActiveSection] = useState("dashboard");

// //   const userProjects = getUserProjects();
// //   const userBoards = getUserBoards();
// //   const userColumns = getUserColumns();
// //   const userTasks = getUserTasks();

// //   const selectedProject = userProjects.find((p) => p.id === selectedProjectId);
// //   const selectedBoard = userBoards.find((b) => b.id === selectedBoardId);

// //   const selectProject = useCallback((projectId) => {
// //     setSelectedProjectId(projectId);
// //     setSelectedBoardId(null);
// //     setActiveSection("project-boards");
// //   }, []);

// //   const selectBoard = useCallback(
// //     (boardId) => {
// //       const board = userBoards.find((b) => b.id === boardId);
// //       if (board) {
// //         setSelectedProjectId(board.projectId);
// //         setSelectedBoardId(boardId);
// //         setActiveSection("board");
// //       }
// //     },
// //     [userBoards]
// //   );

// //   const handleSectionChange = useCallback((section) => {
// //     setActiveSection(section);
// //     setSelectedProjectId(null);
// //     setSelectedBoardId(null);
// //   }, []);

// //   const handleSaveBoard = useCallback(
// //     (updatedBoard) => {
// //       updateBoard(updatedBoard.id, updatedBoard);
// //     },
// //     [updateBoard]
// //   );

// //   const onDragEnd = useCallback(
// //     (result) => {
// //       const { source, destination, draggableId, type } = result;

// //       if (!destination) {
// //         return;
// //       }

// //       if (
// //         source.droppableId === destination.droppableId &&
// //         source.index === destination.index
// //       ) {
// //         return;
// //       }

// //       if (type === "COLUMN") {
// //         return;
// //       }

// //       moveTask(
// //         draggableId,
// //         source.droppableId,
// //         destination.droppableId,
// //         destination.index
// //       );
// //     },
// //     [moveTask]
// //   );

// //   const handleAddBoard = useCallback(
// //     async (projectId, boardName, boardMembers, newProjectName = null) => {
// //       try {
// //         let targetProjectId = projectId;

// //         if (newProjectName) {
// //           const newProject = {
// //             name: newProjectName,
// //             members: boardMembers,
// //           };
// //           const addedProject = await addProject(newProject);
// //           targetProjectId = addedProject.id;
// //         }

// //         const newBoard = {
// //           name: boardName,
// //           projectId: targetProjectId,
// //           members: boardMembers,
// //         };
// //         const addedBoard = await addBoard(targetProjectId, newBoard);

// //         const defaultColumns = [
// //           { title: "To Do", boardId: addedBoard.id },
// //           { title: "In Progress", boardId: addedBoard.id },
// //           { title: "Done", boardId: addedBoard.id },
// //         ];

// //         for (const column of defaultColumns) {
// //           await addColumn(addedBoard.id, column);
// //         }

// //         selectBoard(addedBoard.id);
// //       } catch (error) {
// //         console.error("Error creating new board:", error);
// //       }
// //     },
// //     [addProject, addBoard, addColumn, selectBoard]
// //   );

// //   const toggleSidebar = useCallback(() => {
// //     setIsSidebarCollapsed((prev) => !prev);
// //   }, []);

// //   const handleUpdateBoardName = useCallback(
// //     (boardId, newName) => {
// //       updateBoard(boardId, { name: newName });
// //     },
// //     [updateBoard]
// //   );

// //   const handleDeleteProject = useCallback(
// //     (projectId) => {
// //       deleteProject(projectId);
// //       if (selectedProjectId === projectId) {
// //         setSelectedProjectId(null);
// //         setSelectedBoardId(null);
// //         setActiveSection("dashboard");
// //       }
// //     },
// //     [deleteProject, selectedProjectId]
// //   );

// //   const handleDeleteBoard = useCallback(
// //     (boardId) => {
// //       deleteBoard(boardId);
// //       if (selectedBoardId === boardId) {
// //         setSelectedBoardId(null);
// //         setActiveSection("project-boards");
// //       }
// //     },
// //     [deleteBoard, selectedBoardId]
// //   );

// //   const handleAddColumn = useCallback(
// //     (boardId, newColumn) => {
// //       addColumn(boardId, newColumn);
// //     },
// //     [addColumn]
// //   );

// //   const handleUpdateColumn = useCallback(
// //     (columnId, updatedData) => {
// //       updateColumn(columnId, updatedData);
// //     },
// //     [updateColumn]
// //   );

// //   const handleDeleteColumn = useCallback(
// //     (columnId) => {
// //       deleteColumn(columnId);
// //     },
// //     [deleteColumn]
// //   );

// //   const handleLogin = useCallback(
// //     (loggedInUser) => {
// //       login(loggedInUser);
// //       setSelectedProjectId(null);
// //       setSelectedBoardId(null);
// //       setActiveSection("dashboard");
// //     },
// //     [login]
// //   );

// //   const handleLogout = useCallback(() => {
// //     logout();
// //     setSelectedProjectId(null);
// //     setSelectedBoardId(null);
// //     setActiveSection("dashboard");
// //   }, [logout]);

// //   const handleBackToProjects = useCallback(() => {
// //     setSelectedProjectId(null);
// //     setSelectedBoardId(null);
// //     setActiveSection("projects");
// //   }, []);

// //   if (!currentUser) {
// //     return <Login onLogin={handleLogin} />;
// //   }

// //   return (
// //     <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
// //       <Header
// //         selectedBoard={selectedBoard}
// //         projects={userProjects}
// //         onAddBoard={handleAddBoard}
// //         onLogout={handleLogout}
// //         user={currentUser}
// //         onUpdateBoardName={handleUpdateBoardName}
// //         toggleSidebar={toggleSidebar}
// //         isSidebarCollapsed={isSidebarCollapsed}
// //       />
// //       <Box sx={{ display: "flex", flexGrow: 1 }}>
// //         <Sidebar
// //           isSidebarCollapsed={isSidebarCollapsed}
// //           selectProject={selectProject}
// //           selectBoard={selectBoard}
// //           selectedProject={selectedProject}
// //           selectedBoard={selectedBoard}
// //           onDeleteProject={handleDeleteProject}
// //           onDeleteBoard={handleDeleteBoard}
// //           onLogout={handleLogout}
// //           onSectionChange={handleSectionChange}
// //         />
// //         <Box
// //           component="main"
// //           sx={{
// //             flexGrow: 1,
// //             display: "flex",
// //             flexDirection: "column",
// //             backgroundColor: "#f2f6f8",
// //             overflowY: "auto",
// //             p: 2,
// //           }}
// //         >

// //           {activeSection === "dashboard" && (
// //             <Box
// //               style={{
// //                 minHeight: "100%",
// //                 minWidth: "700px",
// //                 margin: "0 auto",
// //                 display: "flex",
// //                 justifyContent: "center",
// //                 alignItems: "center",
// //               }}
// //             >
// //               {userProjects.length === 0 &&
// //               userBoards.length === 0 &&
// //               userTasks.length === 0 ? (
// //                 <Typography variant="h6" sx={{ color: "text.secondary" }}>
// //                   No activity yet. Create a project or board to see updates
// //                   here.
// //                 </Typography>
// //               ) : (
// //                 <Box
// //                   sx={{
// //                     display: "flex",
// //                     flexDirection: "column",
// //                     gap: 2,
// //                     width: "100%",
// //                   }}
// //                 >
// //                   {[
// //                     ...userProjects.map((project) => ({
// //                       id: `project-${project.id}`,
// //                       type: "project",
// //                       title: `Project "${project.name}" created`,
// //                       description: `A new project was added by ${
// //                         currentUser?.name || "you"
// //                       }.`,
// //                       timestamp: project.createdAt || new Date().toISOString(),
// //                     })),
// //                     ...userBoards.map((board) => ({
// //                       id: `board-${board.id}`,
// //                       type: "board",
// //                       title: `Board "${board.name}" added to ${
// //                         userProjects.find((p) => p.id === board.projectId)
// //                           ?.name || "a project"
// //                       }`,
// //                       description: `A new board was created by ${
// //                         currentUser?.name || "you"
// //                       }.`,
// //                       timestamp: board.createdAt || new Date().toISOString(),
// //                     })),
// //                     ...userTasks.map((task) => ({
// //                       id: `task-${task.id}`,
// //                       type: "task",
// //                       title: `Task "${task.title}" added to ${
// //                         userBoards.find((b) => b.id === task.boardId)?.name ||
// //                         "a board"
// //                       }`,
// //                       description: `Assigned to ${
// //                         members.find((m) => m.id === task.assigneeId)?.name ||
// //                         "unassigned"
// //                       }.`,
// //                       timestamp: task.createdAt || new Date().toISOString(),
// //                     })),
// //                   ]
// //                     .sort(
// //                       (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
// //                     )
// //                     .map((activity) => (
// //                       <Card
// //                         key={activity.id}
// //                         sx={{
// //                           backgroundColor: "#fff",
// //                           boxShadow: "none",
// //                           borderRadius: "12px",
// //                           display: "flex",
// //                           alignItems: "center",
// //                           p: 2,
// //                         }}
// //                       >
// //                         <Box sx={{ mr: 2 }}>
// //                           <svg
// //                             width="40"
// //                             height="40"
// //                             viewBox="0 0 138 105"
// //                             fill="none"
// //                             xmlns="http://www.w3.org/2000/svg"
// //                           >
// //                             <g clip-path="url(#clip0_125_5403)">
// //                               <path
// //                                 d="M124.581 5.73047H44.0962L44.3419 6.35373L50.355 21.3683L123.747 21.4289C123.747 21.4289 126.407 21.5803 127.883 21.9136L127.73 21.8595V8.89006C127.73 7.14363 126.321 5.73263 124.581 5.73263V5.73047Z"
// //                                 fill="white"
// //                               />
// //                               <path
// //                                 d="M123.747 21.4268L50.355 21.3662L44.3419 6.35164L41.7987 0H6.67047C2.98285 0 0 2.99728 0 6.70006V98.2999C0 101.998 2.98285 105 6.67047 105H131.323C135.011 105 137.998 101.998 137.998 98.2999V35.2727C137.998 28.9102 133.705 23.5562 127.881 21.9115C126.405 21.5761 123.745 21.4268 123.745 21.4268H123.747ZM136.519 90.0331V95.0322H1.49143V90.0331H136.519Z"
// //                                 fill="#8CC1FF"
// //                               />
// //                               <path
// //                                 d="M136.519 90.0332H1.49146V95.0323H136.519V90.0332Z"
// //                                 fill="white"
// //                               />
// //                             </g>
// //                             <defs>
// //                               <clipPath id="clip0_125_5403">
// //                                 <rect width="138" height="105" fill="white" />
// //                               </clipPath>
// //                             </defs>
// //                           </svg>
// //                         </Box>
// //                         <Box sx={{ flexGrow: 1 }}>
// //                           <Typography
// //                             variant="body1"
// //                             sx={{ fontWeight: "bold", color: "#000c19" }}
// //                           >
// //                             {activity.title}
// //                           </Typography>
// //                           <Typography
// //                             variant="body2"
// //                             sx={{ color: "text.secondary" }}
// //                           >
// //                             {activity.description}
// //                           </Typography>
// //                           <Typography
// //                             variant="caption"
// //                             sx={{ color: "text.secondary", mt: 0.5 }}
// //                           >
// //                             {new Date(activity.timestamp).toLocaleString()}
// //                           </Typography>
// //                         </Box>
// //                       </Card>
// //                     ))}
// //                 </Box>
// //               )}
// //             </Box>
// //           )}

// //           {activeSection === "projects" && (
// //             <Box
// //               style={{
// //                 padding: "20px",
// //                 backgroundColor: "#fff",
// //                 borderRadius: "12px",
// //               }}
// //             >
// //               <Typography variant="h4" gutterBottom sx={{ color: "#000c19" }}>
// //                 Projects
// //               </Typography>
// //               {userProjects.length === 0 ? (
// //                 <Typography variant="h6" sx={{ color: "text.secondary" }}>
// //                   No projects available. Create a new project to get started.
// //                 </Typography>
// //               ) : (
// //                 <Box
// //                   sx={{
// //                     display: "grid",
// //                     gridTemplateColumns: {
// //                       xs: "1fr",
// //                       sm: "repeat(3, 1fr)",
// //                       md: "repeat(5, 1fr)",
// //                     },
// //                     gap: 2,
// //                   }}
// //                 >
// //                   {userProjects.map((project) => (
// //                     <div>
// //                       <Card
// //                         key={project.id}
// //                         sx={{
// //                           backgroundColor: "#f2f6f8",
// //                           boxShadow: "none",
// //                           borderRadius: "12px",
// //                           position: "relative",
// //                         }}
// //                       >
// //                         <IconButton
// //                           size="small"
// //                           sx={{ position: "absolute", top: 8, right: 8 }}
// //                         >
// //                           <DeleteOutlineOutlined
// //                             onClick={() => handleDeleteProject(project.id)}
// //                           />
// //                         </IconButton>
// //                         <CardContent>
// //                           <svg
// //                             width="80"
// //                             height="80"
// //                             viewBox="0 0 138 105"
// //                             fill="none"
// //                             xmlns="http://www.w3.org/2000/svg"
// //                             style={{
// //                               margin: "auto",
// //                               display: "flex",
// //                               cursor: "pointer",
// //                             }}
// //                             onClick={() => selectProject(project.id)}
// //                           >
// //                             <g clip-path="url(#clip0_125_5403)">
// //                               <path
// //                                 d="M124.581 5.73047H44.0962L44.3419 6.35373L50.355 21.3683L123.747 21.4289C123.747 21.4289 126.407 21.5803 127.883 21.9136L127.73 21.8595V8.89006C127.73 7.14363 126.321 5.73263 124.581 5.73263V5.73047Z"
// //                                 fill="white"
// //                               />
// //                               <path
// //                                 d="M123.747 21.4268L50.355 21.3662L44.3419 6.35164L41.7987 0H6.67047C2.98285 0 0 2.99728 0 6.70006V98.2999C0 101.998 2.98285 105 6.67047 105H131.323C135.011 105 137.998 101.998 137.998 98.2999V35.2727C137.998 28.9102 133.705 23.5562 127.881 21.9115C126.405 21.5761 123.745 21.4268 123.745 21.4268H123.747ZM136.519 90.0331V95.0322H1.49143V90.0331H136.519Z"
// //                                 fill="#8CC1FF"
// //                               />
// //                               <path
// //                                 d="M136.519 90.0332H1.49146V95.0323H136.519V90.0332Z"
// //                                 fill="white"
// //                               />
// //                             </g>
// //                             <defs>
// //                               <clipPath id="clip0_125_5403">
// //                                 <rect width="138" height="105" fill="white" />
// //                               </clipPath>
// //                             </defs>
// //                           </svg>
// //                         </CardContent>
// //                       </Card>
// //                       <p
// //                         style={{
// //                           textAlign: "center",
// //                           color: "#000c19",
// //                           fontSize: "14px",
// //                           fontWeight: "bold",
// //                         }}
// //                       >
// //                         {typeof project.name === "string"
// //                           ? project.name
// //                           : "Unnamed Project"}
// //                       </p>
// //                     </div>
// //                   ))}
// //                 </Box>
// //               )}
// //             </Box>
// //           )}

// //           {activeSection === "project-boards" && selectedProject && (
// //             <Box
// //               style={{
// //                 padding: "20px",
// //                 backgroundColor: "#fff",
// //                 borderRadius: "12px",
// //               }}
// //             >
// //               <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
// //                 <Button
// //                   onClick={handleBackToProjects}
// //                   sx={{
// //                     color: "#fff",
// //                     mr: 2,
// //                     backgroundColor: "#023250",
// //                     "&:hover": { backgroundColor: "#01416e" },
// //                   }}
// //                 >
// //                   <ArrowBack />
// //                 </Button>
// //                 <Typography variant="h4" sx={{ color: "#000c19" }}>
// //                   {selectedProject.name} - Boards
// //                 </Typography>
// //               </Box>
// //               {userBoards.filter((b) => b.projectId === selectedProject.id)
// //                 .length === 0 ? (
// //                 <Typography variant="h6" sx={{ color: "text.secondary" }}>
// //                   No boards available. Create a new board to get started.
// //                 </Typography>
// //               ) : (
// //                 <Box
// //                   sx={{
// //                     display: "grid",
// //                     gridTemplateColumns: {
// //                       xs: "1fr",
// //                       sm: "repeat(3, 1fr)",
// //                       md: "repeat(5, 1fr)",
// //                     },
// //                     gap: 2,
// //                   }}
// //                 >
// //                   {userBoards
// //                     .filter((b) => b.projectId === selectedProject.id)
// //                     .map((board) => (
// //                       <div>
// //                         <Card
// //                           key={board.id}
// //                           sx={{
// //                             backgroundColor: "#f2f6f8",
// //                             boxShadow: "none",
// //                             borderRadius: "12px",
// //                             position: "relative",
// //                           }}
// //                         >
// //                           <IconButton
// //                             size="small"
// //                             sx={{ position: "absolute", top: 8, right: 8 }}
// //                           >
// //                             <DeleteOutlineOutlined
// //                               onClick={() => handleDeleteProject(board.id)}
// //                             />
// //                           </IconButton>
// //                           <CardContent>
// //                             <svg
// //                               width="80"
// //                               height="80"
// //                               viewBox="0 0 138 105"
// //                               fill="none"
// //                               xmlns="http://www.w3.org/2000/svg"
// //                               style={{
// //                                 margin: "auto",
// //                                 display: "flex",
// //                                 cursor: "pointer",
// //                               }}
// //                               onClick={() => selectBoard(board.id)}
// //                             >
// //                               <g clip-path="url(#clip0_125_5403)">
// //                                 <path
// //                                   d="M124.581 5.73047H44.0962L44.3419 6.35373L50.355 21.3683L123.747 21.4289C123.747 21.4289 126.407 21.5803 127.883 21.9136L127.73 21.8595V8.89006C127.73 7.14363 126.321 5.73263 124.581 5.73263V5.73047Z"
// //                                   fill="white"
// //                                 />
// //                                 <path
// //                                   d="M123.747 21.4268L50.355 21.3662L44.3419 6.35164L41.7987 0H6.67047C2.98285 0 0 2.99728 0 6.70006V98.2999C0 101.998 2.98285 105 6.67047 105H131.323C135.011 105 137.998 101.998 137.998 98.2999V35.2727C137.998 28.9102 133.705 23.5562 127.881 21.9115C126.405 21.5761 123.745 21.4268 123.745 21.4268H123.747ZM136.519 90.0331V95.0322H1.49143V90.0331H136.519Z"
// //                                   fill="#8CC1FF"
// //                                 />
// //                                 <path
// //                                   d="M136.519 90.0332H1.49146V95.0323H136.519V90.0332Z"
// //                                   fill="white"
// //                                 />
// //                               </g>
// //                               <defs>
// //                                 <clipPath id="clip0_125_5403">
// //                                   <rect width="138" height="105" fill="white" />
// //                                 </clipPath>
// //                               </defs>
// //                             </svg>
// //                           </CardContent>
// //                         </Card>
// //                         <p
// //                           style={{
// //                             textAlign: "center",
// //                             color: "#000c19",
// //                             fontSize: "14px",
// //                             fontWeight: "bold",
// //                           }}
// //                         >
// //                           {typeof board.name === "string"
// //                             ? board.name
// //                             : "Unnamed Board"}
// //                         </p>
// //                       </div>
// //                     ))}
// //                 </Box>
// //               )}
// //             </Box>
// //           )}

// //           {activeSection === "board" && selectedBoard && (
// //             <DragDropContext onDragEnd={onDragEnd}>
// //               <Board
// //                 key={`${selectedBoard.id}-${Date.now()}`}
// //                 board={selectedBoard}
// //                 columns={userColumns.filter(
// //                   (c) => c.boardId === selectedBoard.id
// //                 )}
// //                 tasks={userTasks.filter((t) => t.boardId === selectedBoard.id)}
// //                 onSaveBoard={handleSaveBoard}
// //                 boardMembers={members.filter((m) =>
// //                   selectedBoard.members.includes(m.id)
// //                 )}
// //                 availableLabels={labels}
// //                 onAddTask={addTask}
// //                 onUpdateTask={updateTask}
// //                 onDeleteTask={deleteTask}
// //                 onAddColumn={handleAddColumn}
// //                 onUpdateColumn={handleUpdateColumn}
// //                 onDeleteColumn={handleDeleteColumn}
// //               />
// //             </DragDropContext>
// //           )}
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // }

// // export default App;

// import React, { useState, useCallback } from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import { DragDropContext } from "react-beautiful-dnd";
// import Sidebar from "./components/Sidebar";
// import Header from "./components/Header";
// import Board from "./components/Board";
// import Login from "./components/Login";
// import { DataProvider, useData } from "./contexts/DataContext";
// import { ArrowBack, DeleteOutlineOutlined } from "@mui/icons-material";
// import { IconButton, Chip, Divider } from "@mui/material";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#182600",
//     },
//     secondary: {
//       main: "#f50057",
//     },
//     background: {
//       default: "#f5f5f5",
//     },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontSize: "2.5rem",
//       fontWeight: 500,
//     },
//     h2: {
//       fontSize: "2rem",
//       fontWeight: 500,
//     },
//     body1: {
//       fontSize: "0.8rem",
//       lineHeight: 1.5,
//     },
//   },
//   shape: {
//     borderRadius: 6,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//         },
//       },
//     },
//   },
// });

// function App() {
//   return (
//     <DataProvider>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <AppContent />
//       </ThemeProvider>
//     </DataProvider>
//   );
// }

// function AppContent() {
//   const {
//     currentUser,
//     login,
//     logout,
//     getUserProjects,
//     getUserBoards,
//     getUserColumns,
//     getUserTasks,
//     addProject,
//     deleteProject,
//     addBoard,
//     updateBoard,
//     deleteBoard,
//     addColumn,
//     updateColumn,
//     deleteColumn,
//     addTask,
//     updateTask,
//     deleteTask,
//     moveTask,
//     members,
//     labels,
//     addMember,
//   } = useData();

//   const [selectedProjectId, setSelectedProjectId] = useState(null);
//   const [selectedBoardId, setSelectedBoardId] = useState(null);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [activeSection, setActiveSection] = useState("dashboard");

//   const userProjects = getUserProjects();
//   const userBoards = getUserBoards();
//   const userColumns = getUserColumns();
//   const userTasks = getUserTasks();

//   console.log("userProjects", userProjects);
//   console.log("userBoards", userBoards);
//   console.log("userColumns", userColumns);
//   console.log("userTasks", userTasks);
//   console.log("members", members);
//   console.log("labels", labels);
//   console.log("addMember in App:", addMember);

//   const selectedProject = userProjects.find((p) => p.id === selectedProjectId);
//   const selectedBoard = userBoards.find((b) => b.id === selectedBoardId);

//   const selectProject = useCallback((projectId) => {
//     setSelectedProjectId(projectId);
//     setSelectedBoardId(null);
//     setActiveSection("project-boards");
//   }, []);

//   const selectBoard = useCallback(
//     (boardId) => {
//       const board = userBoards.find((b) => b.id === boardId);
//       if (board) {
//         setSelectedProjectId(board.projectId);
//         setSelectedBoardId(boardId);
//         setActiveSection("board");
//       }
//     },
//     [userBoards]
//   );

//   const handleSectionChange = useCallback((section) => {
//     setActiveSection(section);
//     setSelectedProjectId(null);
//     setSelectedBoardId(null);
//   }, []);

//   const handleSaveBoard = useCallback(
//     (updatedBoard) => {
//       updateBoard(updatedBoard.id, updatedBoard);
//     },
//     [updateBoard]
//   );

//   const onDragEnd = useCallback(
//     (result) => {
//       const { source, destination, draggableId, type } = result;

//       if (!destination) {
//         return;
//       }

//       if (
//         source.droppableId === destination.droppableId &&
//         source.index === destination.index
//       ) {
//         return;
//       }

//       if (type === "COLUMN") {
//         return;
//       }

//       moveTask(
//         draggableId,
//         source.droppableId,
//         destination.droppableId,
//         destination.index
//       );
//     },
//     [moveTask]
//   );

//   const handleAddBoard = useCallback(
//     async (projectId, boardName, boardMembers, newProjectName = null) => {
//       try {
//         let targetProjectId = projectId;

//         if (newProjectName) {
//           const newProject = {
//             name: newProjectName,
//             members: boardMembers,
//           };
//           const addedProject = await addProject(newProject);
//           targetProjectId = addedProject.id;
//         }

//         const newBoard = {
//           name: boardName,
//           projectId: targetProjectId,
//           members: boardMembers,
//         };
//         const addedBoard = await addBoard(targetProjectId, newBoard);

//         const defaultColumns = [
//           { title: "To Do", boardId: addedBoard.id },
//           { title: "In Progress", boardId: addedBoard.id },
//           { title: "Done", boardId: addedBoard.id },
//         ];

//         for (const column of defaultColumns) {
//           await addColumn(addedBoard.id, column);
//         }

//         selectBoard(addedBoard.id);
//       } catch (error) {
//         console.error("Error creating new board:", error);
//       }
//     },
//     [addProject, addBoard, addColumn, selectBoard]
//   );

//   const toggleSidebar = useCallback(() => {
//     setIsSidebarCollapsed((prev) => !prev);
//   }, []);

//   const handleUpdateBoardName = useCallback(
//     (boardId, newName) => {
//       updateBoard(boardId, { name: newName });
//     },
//     [updateBoard]
//   );

//   const handleDeleteProject = useCallback(
//     (projectId) => {
//       deleteProject(projectId);
//       if (selectedProjectId === projectId) {
//         setSelectedProjectId(null);
//         setSelectedBoardId(null);
//         setActiveSection("dashboard");
//       }
//     },
//     [deleteProject, selectedProjectId]
//   );

//   const handleDeleteBoard = useCallback(
//     (boardId) => {
//       deleteBoard(boardId);
//       if (selectedBoardId === boardId) {
//         setSelectedBoardId(null);
//         setActiveSection("project-boards");
//       }
//     },
//     [deleteBoard, selectedBoardId]
//   );

//   const handleAddColumn = useCallback(
//     (boardId, newColumn) => {
//       addColumn(boardId, newColumn);
//     },
//     [addColumn]
//   );

//   const handleUpdateColumn = useCallback(
//     (columnId, updatedData) => {
//       updateColumn(columnId, updatedData);
//     },
//     [updateColumn]
//   );

//   const handleDeleteColumn = useCallback(
//     (columnId) => {
//       deleteColumn(columnId);
//     },
//     [deleteColumn]
//   );

//   const handleLogin = useCallback(
//     (loggedInUser) => {
//       login(loggedInUser);
//       setSelectedProjectId(null);
//       setSelectedBoardId(null);
//       setActiveSection("dashboard");
//     },
//     [login]
//   );

//   const handleLogout = useCallback(() => {
//     logout();
//     setSelectedProjectId(null);
//     setSelectedBoardId(null);
//     setActiveSection("dashboard");
//   }, [logout]);

//   const handleBackToProjects = useCallback(() => {
//     setSelectedProjectId(null);
//     setSelectedBoardId(null);
//     setActiveSection("projects");
//   }, []);

//   if (!currentUser) {
//     return <Login onLogin={handleLogin} />;
//   }

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//       <Header
//         selectedBoard={selectedBoard}
//         projects={userProjects}
//         onAddBoard={handleAddBoard}
//         onLogout={handleLogout}
//         user={currentUser}
//         onUpdateBoardName={handleUpdateBoardName}
//         toggleSidebar={toggleSidebar}
//         isSidebarCollapsed={isSidebarCollapsed}
//       />
//       <Box sx={{ display: "flex", flexGrow: 1, mt: 9 }}>
//         <Sidebar
//           isSidebarCollapsed={isSidebarCollapsed}
//           selectProject={selectProject}
//           selectBoard={selectBoard}
//           selectedProject={selectedProject}
//           selectedBoard={selectedBoard}
//           onDeleteProject={handleDeleteProject}
//           onDeleteBoard={handleDeleteBoard}
//           onLogout={handleLogout}
//           onSectionChange={handleSectionChange}
//         />
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             display: "flex",
//             flexDirection: "column",
//             backgroundColor: "#f2f6f8",
//             overflowY: "auto",
//             p: 2,
//           }}
//         >
//           {activeSection === "dashboard" && (
//             <Box
//               style={{
//                 minHeight: "100%",
//                 minWidth: "500px",
//                 margin: "0 auto",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               {userProjects.length === 0 &&
//               userBoards.length === 0 &&
//               userTasks.length === 0 ? (
//                 <Typography variant="h6" sx={{ color: "text.secondary" }}>
//                   No activity yet. Create a project or board to see updates
//                   here.
//                 </Typography>
//               ) : (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 2,
//                     width: "100%",
//                   }}
//                 >
//                   {userTasks.map((task) => {
//                     // Find the column for this task
//                     const column = userColumns.find(
//                       (col) => col.id === task.columnId
//                     );
//                     const status = column ? column.title : "Unknown";

//                     const memberId = task.members && task.members[0];
//                     const member = members.find((m) => m.id === memberId) || {
//                       name: "Unknown",
//                       imageUrl:
//                         "https://www.pngkey.com/png/full/73-730434_04-dummy-avatar.png",
//                     };

//                     const labelId = task.labels && task.labels[0];
//                     const priority = labels.find(
//                       (label) => label.id === labelId
//                     ) || {
//                       name: "Unknown",
//                       color: "#474747",
//                     };

//                     // Format due date
//                     const dueDate = task.dueDate
//                       ? new Date(task.dueDate).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })
//                       : "Not Set";

//                     return (
//                       <Card
//                         key={task.id}
//                         sx={{
//                           borderRadius: "12px",
//                           padding: "16px",
//                           boxShadow: "none",
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                           }}
//                         >
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <img
//                               src={member.imageUrl}
//                               alt={member.name}
//                               style={{
//                                 width: "40px",
//                                 height: "40px",
//                                 borderRadius: "50%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                             <Box sx={{ ml: 2 }}>
//                               <Typography
//                                 variant="subtitle1"
//                                 sx={{ fontWeight: "bold" }}
//                               >
//                                 {member.name}
//                               </Typography>
//                             </Box>
//                           </Box>
//                           <Box
//                             sx={{
//                               backgroundColor: (() => {
//                                 switch (status.toLowerCase()) {
//                                   case "to do":
//                                     return "#bbdefb";
//                                   case "in progress":
//                                     return "#ffe0b2";
//                                   case "done":
//                                     return "#c8e6c9";
//                                   default:
//                                     return "#e0e0e0";
//                                 }
//                               })(),
//                               color: (() => {
//                                 switch (status.toLowerCase()) {
//                                   case "to do":
//                                     return "#1976d2";
//                                   case "in progress":
//                                     return "#f57c00";
//                                   case "done":
//                                     return "#388e3c";
//                                   default:
//                                     return "#616161";
//                                 }
//                               })(),
//                               padding: "4px 8px",
//                               borderRadius: "12px",
//                               fontSize: "12px",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {status}
//                           </Box>
//                         </Box>
//                         <Divider sx={{ my: 2 }} />
//                         <Typography variant="body1" sx={{ mt: 1 }}>
//                           <strong>Task:</strong> {task.content}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mt: 1 }}>
//                           <strong>Deadline:</strong> {dueDate}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mt: 1 }}>
//                           <strong>Priority:</strong>{" "}
//                           <span
//                             style={{
//                               color: `${priority.color}`,
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {priority.name}
//                           </span>
//                         </Typography>
//                       </Card>
//                     );
//                   })}
//                 </Box>
//               )}
//             </Box>
//           )}

//           {activeSection === "projects" && (
//             <Box
//               style={{
//                 padding: "20px",
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//               }}
//             >
//               <Typography variant="h4" gutterBottom sx={{ color: "#000c19" }}>
//                 Projects
//               </Typography>
//               {userProjects.length === 0 ? (
//                 <Typography variant="h6" sx={{ color: "text.secondary" }}>
//                   No projects available. Create a new project to get started.
//                 </Typography>
//               ) : (
//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: {
//                       xs: "1fr",
//                       sm: "repeat(3, 1fr)",
//                       md: "repeat(5, 1fr)",
//                     },
//                     gap: 2,
//                   }}
//                 >
//                   {userProjects.map((project) => (
//                     <div key={project.id}>
//                       <Card
//                         sx={{
//                           backgroundColor: "#f2f6f8",
//                           boxShadow: "none",
//                           borderRadius: "12px",
//                           position: "relative",
//                         }}
//                       >
//                         <IconButton
//                           size="small"
//                           sx={{ position: "absolute", top: 8, right: 8 }}
//                         >
//                           <DeleteOutlineOutlined
//                             onClick={() => handleDeleteProject(project.id)}
//                           />
//                         </IconButton>
//                         <CardContent>
//                           <svg
//                             width="80"
//                             height="80"
//                             viewBox="0 0 138 105"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                             style={{
//                               margin: "auto",
//                               display: "flex",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => selectProject(project.id)}
//                           >
//                             <g clip-path="url(#clip0_125_5403)">
//                               <path
//                                 d="M124.581 5.73047H44.0962L44.3419 6.35373L50.355 21.3683L123.747 21.4289C123.747 21.4289 126.407 21.5803 127.883 21.9136L127.73 21.8595V8.89006C127.73 7.14363 126.321 5.73263 124.581 5.73263V5.73047Z"
//                                 fill="white"
//                               />
//                               <path
//                                 d="M123.747 21.4268L50.355 21.3662L44.3419 6.35164L41.7987 0H6.67047C2.98285 0 0 2.99728 0 6.70006V98.2999C0 101.998 2.98285 105 6.67047 105H131.323C135.011 105 137.998 101.998 137.998 98.2999V35.2727C137.998 28.9102 133.705 23.5562 127.881 21.9115C126.405 21.5761 123.745 21.4268 123.745 21.4268H123.747ZM136.519 90.0331V95.0322H1.49143V90.0331H136.519Z"
//                                 fill="#8CC1FF"
//                               />
//                               <path
//                                 d="M136.519 90.0332H1.49146V95.0323H136.519V90.0332Z"
//                                 fill="white"
//                               />
//                             </g>
//                             <defs>
//                               <clipPath id="clip0_125_5403">
//                                 <rect width="138" height="105" fill="white" />
//                               </clipPath>
//                             </defs>
//                           </svg>
//                         </CardContent>
//                       </Card>
//                       <p
//                         style={{
//                           textAlign: "center",
//                           color: "#000c19",
//                           fontSize: "14px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {typeof project.name === "string"
//                           ? project.name
//                           : "Unnamed Project"}
//                       </p>
//                     </div>
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           )}

//           {activeSection === "project-boards" && selectedProject && (
//             <Box
//               style={{
//                 padding: "20px",
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//               }}
//             >
//               <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                 <Button
//                   onClick={handleBackToProjects}
//                   sx={{
//                     color: "#fff",
//                     mr: 2,
//                     backgroundColor: "#023250",
//                     "&:hover": { backgroundColor: "#01416e" },
//                   }}
//                 >
//                   <ArrowBack />
//                 </Button>
//                 <Typography variant="h4" sx={{ color: "#000c19" }}>
//                   {selectedProject.name} - Boards
//                 </Typography>
//               </Box>
//               {userBoards.filter((b) => b.projectId === selectedProject.id)
//                 .length === 0 ? (
//                 <Typography variant="h6" sx={{ color: "text.secondary" }}>
//                   No boards available. Create a new board to get started.
//                 </Typography>
//               ) : (
//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: {
//                       xs: "1fr",
//                       sm: "repeat(3, 1fr)",
//                       md: "repeat(5, 1fr)",
//                     },
//                     gap: 2,
//                   }}
//                 >
//                   {userBoards
//                     .filter((b) => b.projectId === selectedProject.id)
//                     .map((board) => (
//                       <div key={board.id}>
//                         <Card
//                           sx={{
//                             backgroundColor: "#f2f6f8",
//                             boxShadow: "none",
//                             borderRadius: "12px",
//                             position: "relative",
//                           }}
//                         >
//                           <IconButton
//                             size="small"
//                             sx={{ position: "absolute", top: 8, right: 8 }}
//                           >
//                             <DeleteOutlineOutlined
//                               onClick={() => handleDeleteBoard(board.id)}
//                             />
//                           </IconButton>
//                           <CardContent>
//                             <svg
//                               width="80"
//                               height="80"
//                               viewBox="0 0 138 105"
//                               fill="none"
//                               xmlns="http://www.w3.org/2000/svg"
//                               style={{
//                                 margin: "auto",
//                                 display: "flex",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => selectBoard(board.id)}
//                             >
//                               <g clip-path="url(#clip0_125_5403)">
//                                 <path
//                                   d="M124.581 5.73047H44.0962L44.3419 6.35373L50.355 21.3683L123.747 21.4289C123.747 21.4289 126.407 21.5803 127.883 21.9136L127.73 21.8595V8.89006C127.73 7.14363 126.321 5.73263 124.581 5.73263V5.73047Z"
//                                   fill="white"
//                                 />
//                                 <path
//                                   d="M123.747 21.4268L50.355 21.3662L44.3419 6.35164L41.7987 0H6.67047C2.98285 0 0 2.99728 0 6.70006V98.2999C0 101.998 2.98285 105 6.67047 105H131.323C135.011 105 137.998 101.998 137.998 98.2999V35.2727C137.998 28.9102 133.705 23.5562 127.881 21.9115C126.405 21.5761 123.745 21.4268 123.745 21.4268H123.747ZM136.519 90.0331V95.0322H1.49143V90.0331H136.519Z"
//                                   fill="#8CC1FF"
//                                 />
//                                 <path
//                                   d="M136.519 90.0332H1.49146V95.0323H136.519V90.0332Z"
//                                   fill="white"
//                                 />
//                               </g>
//                               <defs>
//                                 <clipPath id="clip0_125_5403">
//                                   <rect width="138" height="105" fill="white" />
//                                 </clipPath>
//                               </defs>
//                             </svg>
//                           </CardContent>
//                         </Card>
//                         <p
//                           style={{
//                             textAlign: "center",
//                             color: "#000c19",
//                             fontSize: "14px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {typeof board.name === "string"
//                             ? board.name
//                             : "Unnamed Board"}
//                         </p>
//                       </div>
//                     ))}
//                 </Box>
//               )}
//             </Box>
//           )}

//           {activeSection === "board" && selectedBoard && (
//             <DragDropContext onDragEnd={onDragEnd}>
//               <Board
//                 key={`${selectedBoard.id}-${Date.now()}`}
//                 board={selectedBoard}
//                 columns={userColumns.filter(
//                   (c) => c.boardId === selectedBoard.id
//                 )}
//                 tasks={userTasks.filter((t) => t.boardId === selectedBoard.id)}
//                 onSaveBoard={handleSaveBoard}
//                 boardMembers={members.filter((m) =>
//                   selectedBoard.members.includes(m.id)
//                 )}
//                 availableLabels={labels}
//                 onAddTask={addTask}
//                 onUpdateTask={updateTask}
//                 onDeleteTask={deleteTask}
//                 onAddColumn={handleAddColumn}
//                 onUpdateColumn={handleUpdateColumn}
//                 onDeleteColumn={handleDeleteColumn}
//               />
//             </DragDropContext>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default App;



import React, { useState, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DragDropContext } from "react-beautiful-dnd";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Board from "./components/Board";
import Login from "./components/Login";
import { DataProvider, useData } from "./contexts/DataContext";
import { ArrowBack, DeleteOutlineOutlined } from "@mui/icons-material";
import { IconButton, Chip, Divider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#182600",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "0.8rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

function App() {
  return (
    <DataProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </DataProvider>
  );
}

function AppContent() {
  const {
    currentUser,
    login,
    logout,
    getUserProjects,
    getUserBoards,
    getUserColumns,
    getUserTasks,
    addProject,
    deleteProject,
    addBoard,
    updateBoard,
    deleteBoard,
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    members,
    labels,
    addMember, // Add this
  } = useData();

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const userProjects = getUserProjects();
  const userBoards = getUserBoards();
  const userColumns = getUserColumns();
  const userTasks = getUserTasks();

  console.log("userProjects", userProjects);
  console.log("userBoards", userBoards);
  console.log("userColumns", userColumns);
  console.log("userTasks", userTasks);
  console.log("members", members);
  console.log("labels", labels);
  console.log("addMember in App:", addMember); // Debug log to verify

  const selectedProject = userProjects.find((p) => p.id === selectedProjectId);
  const selectedBoard = userBoards.find((b) => b.id === selectedBoardId);

  const selectProject = useCallback((projectId) => {
    setSelectedProjectId(projectId);
    setSelectedBoardId(null);
    setActiveSection("project-boards");
  }, []);

  const selectBoard = useCallback(
    (boardId) => {
      const board = userBoards.find((b) => b.id === boardId);
      if (board) {
        setSelectedProjectId(board.projectId);
        setSelectedBoardId(boardId);
        setActiveSection("board");
      }
    },
    [userBoards]
  );

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    setSelectedProjectId(null);
    setSelectedBoardId(null);
  }, []);

  const handleSaveBoard = useCallback(
    (updatedBoard) => {
      updateBoard(updatedBoard.id, updatedBoard);
    },
    [updateBoard]
  );

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId, type } = result;

      if (!destination) {
        return;
      }

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      if (type === "COLUMN") {
        return;
      }

      moveTask(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      );
    },
    [moveTask]
  );

  const handleAddBoard = useCallback(
    async (projectId, boardName, boardMembers, newProjectName = null) => {
      try {
        let targetProjectId = projectId;

        if (newProjectName) {
          const newProject = {
            name: newProjectName,
            members: boardMembers,
          };
          const addedProject = await addProject(newProject);
          targetProjectId = addedProject.id;
        }

        const newBoard = {
          name: boardName,
          projectId: targetProjectId,
          members: boardMembers,
        };
        const addedBoard = await addBoard(targetProjectId, newBoard);

        const defaultColumns = [
          { title: "To Do", boardId: addedBoard.id },
          { title: "In Progress", boardId: addedBoard.id },
          { title: "Done", boardId: addedBoard.id },
        ];

        for (const column of defaultColumns) {
          await addColumn(addedBoard.id, column);
        }

        selectBoard(addedBoard.id);
      } catch (error) {
        console.error("Error creating new board:", error);
      }
    },
    [addProject, addBoard, addColumn, selectBoard]
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleUpdateBoardName = useCallback(
    (boardId, newName) => {
      updateBoard(boardId, { name: newName });
    },
    [updateBoard]
  );

  const handleDeleteProject = useCallback(
    (projectId) => {
      deleteProject(projectId);
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
        setSelectedBoardId(null);
        setActiveSection("dashboard");
      }
    },
    [deleteProject, selectedProjectId]
  );

  const handleDeleteBoard = useCallback(
    (boardId) => {
      deleteBoard(boardId);
      if (selectedBoardId === boardId) {
        setSelectedBoardId(null);
        setActiveSection("project-boards");
      }
    },
    [deleteBoard, selectedBoardId]
  );

  const handleAddColumn = useCallback(
    (boardId, newColumn) => {
      addColumn(boardId, newColumn);
    },
    [addColumn]
  );

  const handleUpdateColumn = useCallback(
    (columnId, updatedData) => {
      updateColumn(columnId, updatedData);
    },
    [updateColumn]
  );

  const handleDeleteColumn = useCallback(
    (columnId) => {
      deleteColumn(columnId);
    },
    [deleteColumn]
  );

  const handleLogin = useCallback(
    (loggedInUser) => {
      login(loggedInUser);
      setSelectedProjectId(null);
      setSelectedBoardId(null);
      setActiveSection("dashboard");
    },
    [login]
  );

  const handleLogout = useCallback(() => {
    logout();
    setSelectedProjectId(null);
    setSelectedBoardId(null);
    setActiveSection("dashboard");
  }, [logout]);

  const handleBackToProjects = useCallback(() => {
    setSelectedProjectId(null);
    setSelectedBoardId(null);
    setActiveSection("projects");
  }, []);

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header
        selectedBoard={selectedBoard}
        projects={userProjects}
        onAddBoard={handleAddBoard}
        onAddMember={addMember} // Add this
        onLogout={handleLogout}
        user={currentUser}
        onUpdateBoardName={handleUpdateBoardName}
        toggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <Box sx={{ display: "flex", flexGrow: 1, mt: 9 }}>
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          selectProject={selectProject}
          selectBoard={selectBoard}
          selectedProject={selectedProject}
          selectedBoard={selectedBoard}
          onDeleteProject={handleDeleteProject}
          onDeleteBoard={handleDeleteBoard}
          onLogout={handleLogout}
          onSectionChange={handleSectionChange}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f2f6f8",
            overflowY: "auto",
            p: 2,
          }}
        >
          {activeSection === "dashboard" && (
            <Box
              style={{
                minHeight: "100%",
                minWidth: "500px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {userProjects.length === 0 &&
              userBoards.length === 0 &&
              userTasks.length === 0 ? (
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  No activity yet. Create a project or board to see updates
                  here.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  {userTasks.map((task) => {
                    const column = userColumns.find(
                      (col) => col.id === task.columnId
                    );
                    const status = column ? column.title : "Unknown";

                    const memberId = task.members && task.members[0];
                    const member = members.find((m) => m.id === memberId) || {
                      name: "Unknown",
                      imageUrl:
                        "https://www.pngkey.com/png/full/73-730434_04-dummy-avatar.png",
                    };

                    const labelId = task.labels && task.labels[0];
                    const priority = labels.find(
                      (label) => label.id === labelId
                    ) || {
                      name: "Unknown",
                      color: "#474747",
                    };

                    const dueDate = task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Not Set";

                    return (
                      <Card
                        key={task.id}
                        sx={{
                          borderRadius: "12px",
                          padding: "16px",
                          boxShadow: "none",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}
                              >
                                {member.name}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              backgroundColor: (() => {
                                switch (status.toLowerCase()) {
                                  case "to do":
                                    return "#bbdefb";
                                  case "in progress":
                                    return "#ffe0b2";
                                  case "done":
                                    return "#c8e6c9";
                                  default:
                                    return "#e0e0e0";
                                }
                              })(),
                              color: (() => {
                                switch (status.toLowerCase()) {
                                  case "to do":
                                    return "#1976d2";
                                  case "in progress":
                                    return "#f57c00";
                                  case "done":
                                    return "#388e3c";
                                  default:
                                    return "#616161";
                                }
                              })(),
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {status}
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          <strong>Task:</strong> {task.content}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          <strong>Deadline:</strong> {dueDate}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          <strong>Priority:</strong>{" "}
                          <span
                            style={{
                              color: `${priority.color}`,
                              fontWeight: "bold",
                            }}
                          >
                            {priority.name}
                          </span>
                        </Typography>
                      </Card>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {activeSection === "projects" && (
            <Box
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ color: "#000c19" }}>
                Projects
              </Typography>
              {userProjects.length === 0 ? (
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  No projects available. Create a new project to get started.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(3, 1fr)",
                      md: "repeat(5, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {userProjects.map((project) => (
                    <div key={project.id}>
                      <Card
                        sx={{
                          backgroundColor: "#f2f6f8",
                          boxShadow: "none",
                          borderRadius: "12px",
                          position: "relative",
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <DeleteOutlineOutlined
                            onClick={() => handleDeleteProject(project.id)}
                          />
                        </IconButton>
                        <CardContent>
                          <svg
                            width="80"
                            height="80"
                            viewBox="0 0 138 105"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              margin: "auto",
                              display: "flex",
                              cursor: "pointer",
                            }}
                            onClick={() => selectProject(project.id)}
                          >
                            <g clip-path="url(#clip0_125_5403)">
                              <path
                                d="M124.581 5.73047H44.0962L44.3419 6.35373L50.355 21.3683L123.747 21.4289C123.747 21.4289 126.407 21.5803 127.883 21.9136L127.73 21.8595V8.89006C127.73 7.14363 126.321 5.73263 124.581 5.73263V5.73047Z"
                                fill="white"
                              />
                              <path
                                d="M123.747 21.4268L50.355 21.3662L44.3419 6.35164L41.7987 0H6.67047C2.98285 0 0 2.99728 0 6.70006V98.2999C0 101.998 2.98285 105 6.67047 105H131.323C135.011 105 137.998 101.998 137.998 98.2999V35.2727C137.998 28.9102 133.705 23.5562 127.881 21.9115C126.405 21.5761 123.745 21.4268 123.745 21.4268H123.747ZM136.519 90.0331V95.0322H1.49143V90.0331H136.519Z"
                                fill="#8CC1FF"
                              />
                              <path
                                d="M136.519 90.0332H1.49146V95.0323H136.519V90.0332Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_125_5403">
                                <rect width="138" height="105" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </CardContent>
                      </Card>
                      <p
                        style={{
                          textAlign: "center",
                          color: "#000c19",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {typeof project.name === "string"
                          ? project.name
                          : "Unnamed Project"}
                      </p>
                    </div>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {activeSection === "project-boards" && selectedProject && (
            <Box
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Button
                  onClick={handleBackToProjects}
                  sx={{
                    color: "#fff",
                    mr: 2,
                    backgroundColor: "#023250",
                    "&:hover": { backgroundColor: "#01416e" },
                  }}
                >
                  <ArrowBack />
                </Button>
                <Typography variant="h4" sx={{ color: "#000c19" }}>
                  {selectedProject.name} - Boards
                </Typography>
              </Box>
              {userBoards.filter((b) => b.projectId === selectedProject.id)
                .length === 0 ? (
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  No boards available. Create a new board to get started.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(3, 1fr)",
                      md: "repeat(5, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {userBoards
                    .filter((b) => b.projectId === selectedProject.id)
                    .map((board) => (
                      <div key={board.id}>
                        <Card
                          sx={{
                            backgroundColor: "#f2f6f8",
                            boxShadow: "none",
                            borderRadius: "12px",
                            position: "relative",
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{ position: "absolute", top: 8, right: 8 }}
                          >
                            <DeleteOutlineOutlined
                              onClick={() => handleDeleteBoard(board.id)}
                            />
                          </IconButton>
                          <CardContent>
                            <svg
                              width="80"
                              height="80"
                              viewBox="0 0 138 105"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{
                                margin: "auto",
                                display: "flex",
                                cursor: "pointer",
                              }}
                              onClick={() => selectBoard(board.id)}
                            >
                              <g clip-path="url(#clip0_125_5403)">
                                <path
                                  d="M124.581 5.73047H44.0962L44.3419 6.35373L50.355 21.3683L123.747 21.4289C123.747 21.4289 126.407 21.5803 127.883 21.9136L127.73 21.8595V8.89006C127.73 7.14363 126.321 5.73263 124.581 5.73263V5.73047Z"
                                  fill="white"
                                />
                                <path
                                  d="M123.747 21.4268L50.355 21.3662L44.3419 6.35164L41.7987 0H6.67047C2.98285 0 0 2.99728 0 6.70006V98.2999C0 101.998 2.98285 105 6.67047 105H131.323C135.011 105 137.998 101.998 137.998 98.2999V35.2727C137.998 28.9102 133.705 23.5562 127.881 21.9115C126.405 21.5761 123.745 21.4268 123.745 21.4268H123.747ZM136.519 90.0331V95.0322H1.49143V90.0331H136.519Z"
                                  fill="#8CC1FF"
                                />
                                <path
                                  d="M136.519 90.0332H1.49146V95.0323H136.519V90.0332Z"
                                  fill="white"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_125_5403">
                                  <rect width="138" height="105" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </CardContent>
                        </Card>
                        <p
                          style={{
                            textAlign: "center",
                            color: "#000c19",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          {typeof board.name === "string"
                            ? board.name
                            : "Unnamed Board"}
                        </p>
                      </div>
                    ))}
                </Box>
              )}
            </Box>
          )}

          {activeSection === "board" && selectedBoard && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Board
                key={`${selectedBoard.id}-${Date.now()}`}
                board={selectedBoard}
                columns={userColumns.filter(
                  (c) => c.boardId === selectedBoard.id
                )}
                tasks={userTasks.filter((t) => t.boardId === selectedBoard.id)}
                onSaveBoard={handleSaveBoard}
                boardMembers={members.filter((m) =>
                  selectedBoard.members.includes(m.id)
                )}
                availableLabels={labels}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddColumn={handleAddColumn}
                onUpdateColumn={handleUpdateColumn}
                onDeleteColumn={handleDeleteColumn}
              />
            </DragDropContext>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default App;