import nodemailer from "nodemailer";

export async function sendOtpMail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "ISGEC PULSE: Your Registration OTP",
    html: `<h2>Your ISGEC PULSE OTP:</h2><div style='font-size:2rem;'>${otp}</div><p>Please use this to complete your registration.</p>`,
  });
}
