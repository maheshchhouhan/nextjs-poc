"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function Sidebar() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem button onClick={() => handleNavigation("/users")}>
            <ListItemText primary="Users" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
