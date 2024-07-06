"use server";
import pool from "@/services/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/types";
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { setAuthToken } from "./utils";


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

export async function Authenticate(userName: string, password: string, clientId: string) {
  const connection = await pool.getConnection();
  try {

    const response = await fetch('https://dev.exp-inc.com/EXPDev71/api/users/authenticateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'offset': "5.5",
      },
      body: JSON.stringify({
        userName,
        password,
        clientId
      }),
    });

    const result = await response.json();

    if (response.headers.get("Auth_Token")) {
      await setAuthToken(response.headers.get("Auth_Token"));
    }
    return NextResponse.json({ status: true, message: result.message, data: result.data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  } finally {
    connection.release();
  }
}