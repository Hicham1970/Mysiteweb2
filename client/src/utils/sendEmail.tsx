import formData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";

dotenv.config();
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

interface FormData {
  name: string;
  email: string;
  message: string;
}

const sendEmail = async (formData: FormData) => {
  const mailGun = new Mailgun(FormData);
  const mg = mailGun.client({
    username: "api",
    key: MAILGUN_API_KEY,
  });

  try {
    const response = await mg.messages.create("sandbox-123.mailgun.org", {
      from: "HichamGar <h.garoum@gmail.com>",
      to: "h.garoum@gmail.com",
      subject: "Nouveau message de contact",
      text: `Nom: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
      html: `
        <p>Nom: ${formData.name}</p>
        <p>Email: ${formData.email}</p>
        <p>Message: ${formData.message}</p>
      `,
    });

    console.log("Email envoyé avec succès:", response);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
};

export default sendEmail;
