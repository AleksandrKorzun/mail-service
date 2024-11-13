const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Route to handle email sending
app.post("/send-email", async (req, res) => {
  const body = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD, // App-specific password
    },
  });

  // Create the email text from the body
  const text = Object.entries(body).reduce(
    (acc, [key, value]) => (acc += `${key}: ${value}\n`),
    ""
  );

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Change to any recipient(s) you'd like
    subject: "New order from Black Lion Limo",
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
