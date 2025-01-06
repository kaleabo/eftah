import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { User } from "@prisma/client"

// Add proper TypeScript types
declare module 'next-auth' {
  interface User {
    id: string
    email: string | null
    name: string | null 
    role: 'ADMIN' | 'USER'
  }

  interface Session {
    user: User & {
      id: string
      role: 'ADMIN' | 'USER'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'ADMIN' | 'USER'
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // Type assertion to fix adapter compatibility
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in", 
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password! // Changed from hashedPassword to password based on schema
        )

        if (!passwordsMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
          image: user.image,
          password: user.password
        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name || null
        session.user.email = token.email || null
        session.user.role = token.role
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email!,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      }
    }
  }
}