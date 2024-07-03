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
import { User } from "@/types";
import { updateUser } from "@/services/users";

type UserTableProps = {
  users: User[];
};

export default function UserTable({ users }: UserTableProps) {
  const [editRows, setEditRows] = useState<{ [key: number]: boolean }>({});
  const [editedUsers, setEditedUsers] = useState<User[]>(users);
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
    const user = editedUsers.find((user) => user.id === id);

    if (user) {
      const result = await updateUser(user);
      if (result.success) {
        setSnackbarMessage("User updated successfully");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(result.message || "Failed to update user");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    }
  };

  const handleChange = (id: number, field: string, value: string) => {
    setEditedUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [field]: value } : user
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
              {editedUsers.map((user) => (
                <React.Fragment key={user.id}>
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
                              <strong>Name:</strong>{" "}
                              {editRows[user.id] ? (
                                <TextField
                                  value={user.name}
                                  onChange={(e) =>
                                    handleChange(
                                      user.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                />
                              ) : (
                                user.name
                              )}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" component="div">
                              <strong>Email:</strong>{" "}
                              {editRows[user.id] ? (
                                <TextField
                                  value={user.email}
                                  onChange={(e) =>
                                    handleChange(
                                      user.id,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                />
                              ) : (
                                user.email
                              )}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" component="div">
                              <strong>Role:</strong>{" "}
                              {editRows[user.id] ? (
                                <TextField
                                  value={user.role}
                                  onChange={(e) =>
                                    handleChange(
                                      user.id,
                                      "role",
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                />
                              ) : (
                                user.role
                              )}
                            </Typography>
                          </Box>
                          <Box>
                            {editRows[user.id] ? (
                              <Button
                                onClick={() => handleSave(user.id)}
                                fullWidth
                              >
                                Save
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleEdit(user.id)}
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
                        {editRows[user.id] ? (
                          <TextField
                            value={user.name}
                            onChange={(e) =>
                              handleChange(user.id, "name", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          user.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editRows[user.id] ? (
                          <TextField
                            value={user.email}
                            onChange={(e) =>
                              handleChange(user.id, "email", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          user.email
                        )}
                      </TableCell>
                      <TableCell>
                        {editRows[user.id] ? (
                          <TextField
                            value={user.role}
                            onChange={(e) =>
                              handleChange(user.id, "role", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          user.role
                        )}
                      </TableCell>
                      <TableCell>
                        {editRows[user.id] ? (
                          <Button onClick={() => handleSave(user.id)}>
                            Save
                          </Button>
                        ) : (
                          <Button onClick={() => handleEdit(user.id)}>
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
