import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async (email, subject, html) => {
  const mailOptions = {
    from: {
      name: "Shraw",
      address: process.env.MAIL_USER,
    }, // sender address
    to: email, // list of receivers
    subject, // Subject line
    html, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const addMembersEmail = (
  userId,
  name,
  conversationId,
  conversationName,
  adminName
) => {
  const date = new Date();
  const mail = {
    id: userId,
    conversationId,
    created: date.toString(),
  };

  const token_mail_verification = jwt.sign(mail, process.env.JWT_SECRET_MAIL);

  const url =
    process.env.FRONTEND_BASE_URL +
    "join-conversation?id=" +
    conversationId +
    "&verificationString=" +
    token_mail_verification;

  const htmlBody = `<div>Hello <b>${name}</b>, You have been invited to join the conversaion <b>${conversationName}</b> led by <b>${adminName}</b></div><div><a href=${url}><b>Click</b></a> here to join</div>`;
  const subject = "You have been invited to join a conversation";
  return { subject, htmlBody, url };
};

export const conversationDeletionInfoEmail = (
  receiverName,
  conversationName,
  adminName
) => {
  const htmlBody = `<div>Hello <b>${receiverName}</b>, this is to inform you that the admin <b>${adminName}</b> has deleted the conversation <b>${conversationName}</b> .I hope it was meaningful for you! </div>`;
  const subject = `Conversation ${conversationName} has been deleted`;
  return { subject, htmlBody };
};

export const generateUserVerificationEmail = (userId, name) => {
  const date = new Date();
  const mail = {
    id: userId,
    created: date.toString(),
  };

  const token_mail_verification = jwt.sign(mail, process.env.JWT_SECRET_MAIL);

  const url =
    process.env.FRONTEND_BASE_URL +
    "verify-email?id=" +
    userId +
    "&verificationString=" +
    token_mail_verification;

  const htmlBody = `<div>Hello <b>${name}</b>, Thanks for signing up</div><div>The next step is to verify your email address</div><div><a href=${url}><b>Click</b></a> here to verify</div>`;
  const subject = "Welcome to Shraw, Verify your email address";
  return { subject, htmlBody, token_mail_verification };
};
