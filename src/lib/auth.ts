import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // console.log({user, url, token});
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prisma.blog@gmail.com>', // sender address
          to: user.email,
          subject: "Blog Mail", // subject line
          text: "Send message form prisma-blog.", // plain text body
          html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Welcome to Prisma Blog!</h2>
    <p>Hi ${user.name},</p>
    <p>Thank you for signing up. Please verify your email address to activate your account.</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 12px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>If the button doesn't work, copy and paste the following link into your browser:</p>
    <p style="word-break: break-all;"><a href="${verificationUrl}">${verificationUrl}</a></p>
    <hr>
    <p style="font-size: 12px; color: #777;">If you did not create an account, no further action is required.</p>
  </div>
  `, // HTML body
        });
        // console.log("message sent", info.messageId);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
