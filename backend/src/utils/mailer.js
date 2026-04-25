import nodemailer from "nodemailer";
import { formatCurrency } from "./currency.js";

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

export async function sendReminderEmail({ to, title, dueDate, amount }) {
  const client = getTransporter();

  if (!client) {
    return false;
  }

  await client.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Reminder: ${title}`,
    text: `Reminder for ${title} due on ${new Date(dueDate).toLocaleDateString("en-IN")}. Amount: ${formatCurrency(amount)}.`
  });

  return true;
}
