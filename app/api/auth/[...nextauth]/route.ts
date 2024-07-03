import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare, genSalt, hash } from 'bcryptjs';
import pool from '@/services/db';
import { Credentials } from '@/types';


async function generateHash() {
  const salt = await genSalt(12);
  const hashed = await hash('exp2023E', salt);
  console.log('Generated hash:', hashed);
}

generateHash();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const creds = credentials as Credentials;
        if (!creds.email || !creds.password) {
          throw new Error('Missing email or password');
        }

        const connection = await pool.getConnection();
        try {
          const query = 'SELECT * FROM users WHERE email = ?';
          const [rows] = await connection.query(query, [creds.email]) as any;

          if (rows.length === 0) {
            throw new Error('No user found with this email');
          }

          const user = rows[0];
          const isValidPassword = await compare(creds.password, user.password);

          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('Unknown error occurred');
          }
        } finally {
          connection.release();
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
