import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://black-lion-limo.web.app"], // Allow only requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
// Route to handle email sending
app.post("/send-email", async (req, res) => {
  const body = req.body;

  // Configure the transporter for Gmail
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
    to: ["BlackLionLimo@hotmail.com"], // Change to any recipient(s) you'd like
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
