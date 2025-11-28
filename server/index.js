import dotenv from 'dotenv';
dotenv.config(); // Doit être appelé en premier pour charger les variables d'environnement

// Ligne de débogage pour vérifier si la clé API est chargée
console.log('Clé API Resend chargée:', process.env.RESEND_API_KEY ? 'Oui' : 'Non (undefined)');

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { sendEmail } from './mailer.js'; // 1. Importer la fonction sendEmail
import { contactRouter } from './routes/contact.js';

const app = express();
app.use(helmet());
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
// En développement, il est souvent plus simple d'autoriser toutes les origines.
// ATTENTION : Pour la production, vous devriez restreindre ceci à l'URL de votre site.
app.use(cors());

// L'ancienne configuration plus restrictive :
// app.use(cors({
//   origin: ['http://localhost:5174', 'http://localhost:5173'], // Assurez-vous que le port de votre client est dans cette liste
// }));
app.use(express.json());

// Routes
app.use('/api/contacts', contactRouter);

// 2. Créer une nouvelle route pour l'envoi d'e-mails
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ message: 'Les champs "to", "subject", et "html" sont requis.' });
  }

  const result = await sendEmail(to, subject, html);

  if (result.success) {
    return res.status(200).json({ message: 'E-mail envoyé avec succès.', data: result.data });
  } else {
    return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.', error: result.message });
  }
});

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});