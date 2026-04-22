import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // TODO: wire up Prisma once BT-05 merges into dev
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email },
        // });
        // if (!user) throw new Error("No account found with this email");
        // const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        // if (!valid) throw new Error("Incorrect password");
        // return { id: user.id, email: user.email, role: user.role, name: user.name };

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };