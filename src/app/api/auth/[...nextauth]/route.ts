import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authOptions } from '@/data/api/authOptions'; // Assuming you're separating your auth logic

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };