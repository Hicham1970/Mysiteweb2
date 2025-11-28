// mailer.js
import { Resend } from "resend";

async function sendEmail(to, subject, html) {
    try {
        // Initialisez le client Resend ici, à l'intérieur de la fonction.
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            // Utilisation de votre domaine vérifié sur Resend
            from: 'MarineScopeSurvey Contact <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Erreur lors de l'envoi de l'e-mail:", error);
            return { success: false, message: error.message };
        }

        console.log("E-mail envoyé avec succès:", data);
        return { success: true, data };
    } catch (error) {
        console.error("Erreur inattendue lors de l'envoi de l'e-mail:", error);
        return { success: false, message: "Erreur interne du serveur." };
    }
}

export { sendEmail };



/***
 const resend = new Resend(process.env.RESEND_API_KEY);

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function sendEmail(prevState: FormState, formData: FormData) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  // Si la validation échoue, retourner les erreurs
  if (!validatedFields.success) {
    const issues = validatedFields.error.issues.map((issue) => issue.message);
    return {
      message: "Erreur de validation.",
      issues,
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    await resend.emails.send({
      from: 'MarineScopeSurvey Contact <onboarding@resend.dev>', // Adresse d'envoi de Resend
      to: 'h.garoum@gmail.com', // Votre adresse email
      subject: `Nouveau message de ${name} via votre portfolio`,
      replyTo: email,
      text: `De: ${name} <${email}>\n\nMessage:\n${message}`,
    });
    return { message: "Message envoyé avec succès !" };
  } catch (error) {
    console.error(error);
    return { message: "Une erreur est survenue lors de l'envoi." };
  }
}
 */