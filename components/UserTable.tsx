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
      <Box sx={{ overflowX: "auto" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {editRows[user.id] ? (
                      <TextField
                        value={user.name}
                        onChange={(e) =>
                          handleChange(user.id, "name", e.target.value)
                        }
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
                      />
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editRows[user.id] ? (
                      <Button onClick={() => handleSave(user.id)}>Save</Button>
                    ) : (
                      <Button onClick={() => handleEdit(user.id)}>Edit</Button>
                    )}
                  </TableCell>
                </TableRow>
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
