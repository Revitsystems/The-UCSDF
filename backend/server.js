import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables (optional but recommended)
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

// Handle form submission
app.post("/submit-form", async (req, res) => {
  const { fname, lname, email, phone, msg } = req.body;

  // Validate input
  if (!fname || !lname || !email || !phone || !msg) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  console.log("Received Data:", req.body);

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "recipient@gmail.com", // Replace with the recipient's email
    subject: "New Contact Form Submission",
    text: `
      Name: ${fname} ${lname}
      Email: ${email}
      Phone: ${phone}
      Message: ${msg}
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.json({ message: "Form submitted and email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Error sending email." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
