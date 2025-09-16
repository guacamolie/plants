import NextAuth from 'next-auth';
// Removed GithubProvider for email/password only
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';



import type { SessionStrategy } from 'next-auth';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email or username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection('users').findOne({
          $or: [
            { email: credentials?.email },
            { username: credentials?.email },
          ],
        });
        if (!user) {
          console.error('NextAuth: User not found for email:', credentials?.email);
          return null;
        }
        if (!user.password) {
          console.error('NextAuth: User has no password set:', user.email);
          return null;
        }
        if (!credentials?.password) {
          console.error('NextAuth: No password provided for email:', credentials?.email);
          return null;
        }
        const { compare } = await import('bcryptjs');
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          console.error('NextAuth: Invalid password for email:', credentials?.email);
          return null;
        }
        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || user.username || user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
