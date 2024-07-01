import { nextAuthOptions } from "@/app/lib/next-auth/options";
import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});
