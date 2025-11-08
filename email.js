const nodemailer = require("nodemailer");
require('dotenv').config()

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com   ",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user:  process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


const mailOptions = {
    from:  process.env.GMAIL_USER,
    to: "shomok.a12@gmail.com",
    subject: "First Mail Test ✔",
    text: "Hiiii, you just sent your first nodejs email "
}

transporter.sendMail(mailOptions, (error, info) => {

    if(error){
        console.log('Error with sending the mail', error)
    } else {
        console.log('Email sent sucssesfuly ^0^ ', info.response)
    }
})



// Wrap in an async IIFE so we can use await.
// (async () => {
//   const info = await transporter.sendMail({
//     from:  process.env.GMAIL_USER,
//     to: "shomok.a12@gmail.com",
//     subject: "First Mail Test ✔",
//     text: "Hiiii, you just sent your first nodejs email ", // plain‑text body
//     html: "<b>Hello world?</b>", // HTML body
//   });

//   console.log("Message sent:", info.messageId);
// })();