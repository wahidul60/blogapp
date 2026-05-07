import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.BETTER_AUTH_URL!],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },

    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {

            try {
                const info = await transporter.sendMail({
                    from: '"Wahidul Hassan" <wahidulhassan60@gmail.com>', // sender address
                    to: "wahidulhassan8@gmail.com", // list of recipients
                    subject: "verify your GMAIL", // subject line
                    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f6f9;">

  <table width="100%" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="600" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:20px; text-align:center; color:white;">
              <h1 style="margin:0;">📝 My Blog App</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333;">
              <h2 style="margin-top:0;">Verify Your Email Address</h2>

              <p>Hello ${await user.name},</p>

              <p>Thanks for signing up for <b>My Blog App</b>. Please verify your email address to activate your account.</p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="{{verification_url}}"
                   style="background:#4f46e5; color:white; padding:12px 25px; text-decoration:none; border-radius:6px; display:inline-block; font-weight:bold;">
                  Verify Email
                </a>
              </div>

              <p>If the button doesn’t work, copy and paste this link into your browser:</p>

              <p style="word-break:break-all; color:#4f46e5;">
                {${url}}
              </p>

              <hr style="margin:30px 0;" />

              <p style="font-size:12px; color:#888;">
                If you didn’t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#666;">
              © 2026 My Blog App. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`,
                });

                console.log("Message sent: %s", info.messageId);
                console.log(`user: ${user}`, `token: ${token}`, `url: ${url}`)
                // Preview URL is only available when using an Ethereal test account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            } catch (err) {
                console.error("Error while sending mail:", err);
            }
        },
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "ACTIVE"
            }
        }
    }

});