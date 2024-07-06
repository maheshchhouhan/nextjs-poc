"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
  Typography,
  Hidden,
} from "@mui/material";
import { ActionItem, User } from "@/types";

type ActionItemTableProps = {
  items: ActionItem[];
};

export default function ActionItemTable({ items }: ActionItemTableProps) {
  const [editRows, setEditRows] = useState<{ [key: number]: boolean }>({});
  const [editedUsers, setEditedUsers] = useState<ActionItem[]>(items);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleEdit = (id: number) => {
    setEditRows({ ...editRows, [id]: true });
  };

  const handleSave = async (id: number) => {
    setEditRows({ ...editRows, [id]: false });
    const item = editedUsers.find((item) => item.id === id);

    if (item) {
      // Update Action item
      // const result = await updateUser(items);
      // if (result.success) {
      //   setSnackbarMessage("User updated successfully");
      //   setSnackbarSeverity("success");
      // } else {
      //   setSnackbarMessage(result.message || "Failed to update item");
      //   setSnackbarSeverity("error");
      // }
      setSnackbarOpen(true);
    }
  };

  const handleChange = (id: number, field: string, value: string) => {
    setEditedUsers((prevUsers) =>
      prevUsers.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }}>
            <Hidden smDown>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
            </Hidden>
            <TableBody>
              {editedUsers.map((item) => (
                <React.Fragment key={item.id}>
                  {isMobile ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ padding: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            p: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" component="div">
                              <strong>Action Item #:</strong>{" "}
                              {editRows[item.id] ? (
                                <TextField
                                  value={item.id.toString()}
                                  // onChange={(e) =>
                                  //   handleChange(
                                  //     item.id,
                                  //     "name",
                                  //     e.target.value
                                  //   )
                                  // }
                                  fullWidth
                                />
                              ) : (
                                item.id.toString()
                              )}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" component="div">
                              <strong>Location:</strong>{" "}
                              {editRows[item.id] ? (
                                <TextField
                                  value={item.locationPath}
                                  // onChange={(e) =>
                                  //   handleChange(
                                  //     item.id,
                                  //     "email",
                                  //     e.target.value
                                  //   )
                                  // }
                                  fullWidth
                                />
                              ) : (
                                item.locationPath
                              )}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" component="div">
                              <strong>Action Item Source:</strong>{" "}
                              {editRows[item.id] ? (
                                <TextField
                                  value={item.source}
                                  // onChange={(e) =>
                                  //   handleChange(
                                  //     item.id,
                                  //     "role",
                                  //     e.target.value
                                  //   )
                                  // }
                                  fullWidth
                                />
                              ) : (
                                item.source
                              )}
                            </Typography>
                          </Box>
                          <Box>
                            {editRows[item.id] ? (
                              <Button
                                onClick={() => handleSave(item.id)}
                                fullWidth
                              >
                                Save
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleEdit(item.id)}
                                fullWidth
                              >
                                Edit
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell>
                        {editRows[item.id] ? (
                          <TextField
                            value={item.id}
                            // onChange={(e) =>
                            //   handleChange(item.id, "name", e.target.value)
                            // }
                            fullWidth
                          />
                        ) : (
                          item.id.toString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editRows[item.id] ? (
                          <TextField
                            value={item.locationPath}
                            // onChange={(e) =>
                            //   handleChange(item.id, "email", e.target.value)
                            // }
                            fullWidth
                          />
                        ) : (
                          item.locationPath
                        )}
                      </TableCell>
                      <TableCell>
                        {editRows[item.id] ? (
                          <TextField
                            value={item.source}
                            onChange={(e) =>
                              handleChange(item.id, "role", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          item.source
                        )}
                      </TableCell>
                      <TableCell>
                        {editRows[item.id] ? (
                          <Button onClick={() => handleSave(item.id)}>
                            Save
                          </Button>
                        ) : (
                          <Button onClick={() => handleEdit(item.id)}>
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
