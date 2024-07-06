"use server";

import React from "react";
import UserTable from "@/components/UserTable";
import { Container } from "@mui/material";
import { getActionItems } from "@/services/actionItems";

export default async function ActionItemsPage() {
  const { items, accessDenied } = await getActionItems();

  if (accessDenied) {
    return <div>Access Denied</div>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 14 }}>
      <UserTable users={items} />
    </Container>
  );
}
