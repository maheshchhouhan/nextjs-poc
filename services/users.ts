"use server";
import pool from "@/services/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/types";

export const fetchAllUsers = async () => {
  const session = (await getServerSession(authOptions)) as { user: User };

  if (!session || session.user.role !== "admin") {
    return { users: [], accessDenied: true };
  }

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE role != "admin"'
    );
    const users = JSON.parse(JSON.stringify(rows));
    return { users, accessDenied: false };
  } finally {
    connection.release();
  }
};

export async function updateUser(user: { id: number; name: string; email: string; role: string }) {
  try {
    console.log('Updating user:', user);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to update user:', errorData);
      throw new Error('Failed to update user');
    }

    console.log('User updated successfully');
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating user:', error.message);
      return { success: false, message: error.message };
    } else {
      console.error('Unknown error updating user');
      return { success: false, message: 'An unknown error occurred' };
    }
  }
}
