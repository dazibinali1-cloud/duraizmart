import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Duraiz Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase() ?? "";
        const password = credentials?.password ?? "";
        if (!email || password.length < 6) return null;
        const isAdmin = email.includes("admin");
        return {
          id: isAdmin ? "duraiz-admin" : "duraiz-customer",
          name: isAdmin ? "Duraiz Admin" : "Duraiz Customer",
          email,
          image: "",
          role: isAdmin ? "admin" : "customer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string | undefined;
      return session;
    },
  },
  pages: { signIn: "/account" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
