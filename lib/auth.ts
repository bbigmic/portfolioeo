import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          let dbUser
          if (!existingUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                emailVerified: new Date(),
              },
            })
            console.log("Created new user:", dbUser.id)
          } else {
            dbUser = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
                image: user.image,
              },
            })
            console.log("Updated existing user:", dbUser.id)
          }

          if (account && dbUser) {
            await prisma.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              update: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
              create: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            })
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.id) {
        (session.user as any).id = token.id
      } else {
        console.warn("Session token missing user ID:", { token, session })
      }
      return session
    },
    async jwt({ token, user, account }) {
      // Podczas pierwszego logowania (user jest dostępny)
      if (user?.email) {
        token.email = user.email
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (dbUser) {
          token.id = dbUser.id
          console.log("JWT: Set user ID from user object:", dbUser.id)
        } else {
          console.warn("JWT: User not found in database:", user.email)
        }
      }
      // Podczas odświeżania tokenu (sprawdź czy mamy email w tokenie)
      else if (token.email && !token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        })
        if (dbUser) {
          token.id = dbUser.id
          console.log("JWT: Set user ID from token email:", dbUser.id)
        } else {
          console.warn("JWT: User not found in database during token refresh:", token.email)
        }
      }
      return token
    },
  },
}

