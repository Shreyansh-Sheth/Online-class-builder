import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { sign } from "jsonwebtoken";
import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
const secret = "secret";
import Prisma from "../../../utils/prismadb.server";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(Prisma),
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        // console.log(account);
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // console.log(user);
      //@ts-ignore
      // console.log(token);
      //@ts-ignore
      session.accessToken = sign(
        { name: user.name, email: user.email, id: user.id },
        secret
      );
      return session;
    },
  },

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: "<REDACTED>",
      clientSecret: "<REDACTED>",
    }),

    // ...add more providers here
  ],
};
export default NextAuth(authOptions);
