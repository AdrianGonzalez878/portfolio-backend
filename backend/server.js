// backend/server.js
require("dotenv").config(); // 👈 Carga las variables desde .env

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5175", // desarrollo
  "https://adriangonzdev.com",   // producción, cambia por tu dominio real
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.options('*', cors());
// Middleware crucial para evitar 403
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Ruta para manejar el envío del formulario de contacto
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Paso 2: Verifica que todos los campos estén presentes
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Configura el transportador de correos con Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // <-- Reemplaza con la contraseña de aplicación
    },
  });

  try {
    // Envía el correo electrónico
    await transporter.sendMail({
      from: email,
      to: "adrianrobertogonzalezantonio@gmail.com", // <-- Puede ser el mismo correo u otro donde quieras recibir mensajes
      subject: `Portfolio Contact from ${name}`,
      text: message,
    });

    // Si todo sale bien, responde con éxito
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

