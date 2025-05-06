const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Ruta para manejar el envío del formulario de contacto
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validar datos
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }
    
    // Configurar el correo electrónico
    const mailOptions = {
      from: `"Formulario de Contacto" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECIPIENT,
      subject: `Formulario de contacto: ${subject}`,
      text: `
        Has recibido un nuevo mensaje desde el formulario de contacto de tu portfolio:
        
        Nombre: ${name}
        Email: ${email}
        Asunto: ${subject}
        
        Mensaje:
        ${message}
      `,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    // Enviar el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    
    res.status(200).json({
      success: true,
      message: 'Tu mensaje ha sido enviado correctamente. Me pondré en contacto contigo pronto.'
    });
    
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({
      success: false,
      message: 'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.'
    });
  }
});

module.exports = router;