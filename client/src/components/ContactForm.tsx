import React, { useState, useEffect } from "react";
import { validateForm } from "../utils/validation";
import Notification from "./Notification";
import axios from 'axios';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    [key: string]: string | null;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);


  // Ce hook gère la disparition automatique de la notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000); // La notification disparaîtra après 3 secondes

      // Nettoyer le minuteur si le composant est démonté ou si la notification change
      return () => clearTimeout(timer);
    }
  }, [notification]); // Se déclenche à chaque fois que l'état `notification` change



  const validateField = (name: string, value: string) => {
    const validationFunction = validateForm[name as keyof typeof validateForm];
    if (validationFunction) {
      const error = validationFunction(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = {
      name: validateForm.name(formData.name),
      email: validateForm.email(formData.email),
      message: validateForm.message(formData.message),
    };

    if (Object.values(formErrors).some((error) => error !== null)) {
      setErrors(formErrors);
      setNotification({
        type: "error",
        message: "Veuillez corriger les erreurs dans le formulaire",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Préparer les données pour l'API Resend via votre backend
      const emailPayload = {
        // L'e-mail est envoyé au propriétaire du site. Remplacez par votre adresse.
        to: "h.garoum@gmail.com",
        subject: `Nouveau message de contact de ${formData.name}`,
        html: `<p>De: ${formData.name} (${formData.email})</p><p>Message: ${formData.message}</p>`,
      };

      console.log("Envoi des données via axios:", emailPayload);

      // Utilisation d'axios pour envoyer les données à votre nouvelle route API
      const response = await axios.post("http://localhost:5000/api/send-email", emailPayload);

      console.log("Statut de la réponse axios:", response.status);
      console.log("Données reçues via axios:", response.data);

      setNotification({
        type: "success",
        message: "Message envoyé avec succès!",
      });
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("Erreur complète:", error);
      let errorMessage = "Erreur de connexion au serveur";
      if (axios.isAxiosError(error) && error.response) {
        // Le serveur a répondu avec un statut autre que 2xx
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      } else if (error instanceof Error) {
        // Autres erreurs JavaScript
        errorMessage = `Erreur: ${error.message}`;
      }
      setNotification({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
              ${errors.name ? "border-red-300" : "border-gray-300"}`}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
              ${errors.email ? "border-red-300" : "border-gray-300"}`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
              ${errors.message ? "border-red-300" : "border-gray-300"}`}
            required
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isLoading || Object.values(errors).some((error) => error !== null)
          }
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${
              isLoading || Object.values(errors).some((error) => error !== null)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
        >
          {isLoading ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>
    </>
  );
}
