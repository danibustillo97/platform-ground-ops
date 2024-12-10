// services/emailService.ts
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-correo@gmail.com', 
    pass: 'tu-contraseña' 
  }
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const mailOptions = {
    from: 'tu-correo@gmail.com', 
    to,
    subject,
    text,
    html 
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ', info.response);
    return info.response;
  } catch (error) {
    console.error('Error al enviar el correo: ', error);
    throw new Error('No se pudo enviar el correo');
  }
  
};
