import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';



import type { SessionStrategy } from 'next-auth';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
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
        if (user && credentials?.password) {
          const { compare } = await import('bcryptjs');
          const isValid = await compare(credentials.password, user.password);
          if (isValid) {
            return {
              id: user._id.toString(),
              email: user.email,
              username: user.username,
            };
          }
        }
        return null;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
