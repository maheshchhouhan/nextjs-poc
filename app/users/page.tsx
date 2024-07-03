"use server";

import React from "react";
import UserTable from "@/components/UserTable";
import { fetchAllUsers } from "@/services/users";
import { Container } from "@mui/material";

export default async function UsersPage() {
  const { users, accessDenied } = await fetchAllUsers();

  if (accessDenied) {
    return <div>Access Denied</div>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 14 }}>
      <UserTable users={users} />
    </Container>
  );
}
