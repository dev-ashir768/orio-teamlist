

import React, { useState, useCallback } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
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
const collapsedWidth = 0;

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
                backgroundImage: "url('/pattern-sidebar.png')",
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
                <ListItemText primary="News Feed" />
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
                backgroundColor: "#000C19",
                backgroundImage: "url('/pattern-sidebar.png')",
                backgroundPosition: "bottom",
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
