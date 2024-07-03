import { NextResponse } from 'next/server';
import pool from '@/services/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const { name, email, role } = await req.json();

  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    await connection.query(query, [name, email, role, id]);
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  } finally {
    connection.release();
  }
}
