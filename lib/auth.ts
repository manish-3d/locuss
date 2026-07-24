import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "BUYER",
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    "http://localhost:3001",
  ],
});
