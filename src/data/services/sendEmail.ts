import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { to, subject, text } = req.body;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default sendEmail;