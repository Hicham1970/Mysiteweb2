import { useEffect } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";


interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  message,
  type,
  onClose,
  duration = 5000,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Définition des styles et icônes par type de notification
  const notificationStyles = {
    success: {
      bgColor: "bg-green-100 border-green-400 text-green-800",
      Icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    },
    error: {
      bgColor: "bg-red-100 border-red-400 text-red-800",
      Icon: <XCircle className="h-5 w-5 text-red-600" />,
    },
    info: {
      bgColor: "bg-blue-100 border-blue-400 text-blue-800",
      Icon: <Info className="h-5 w-5 text-blue-600" />,
    },
  }[type];

  return (
    <div
      // Ajout d'un z-index élevé (z-[100]) pour s'assurer qu'il est au-dessus de la navbar (z-50)
      className={`fixed top-20 right-5 p-4 rounded-lg border-l-4 shadow-xl transition-all duration-300 z-[100] flex items-center space-x-3 ${notificationStyles.bgColor}`}
      role="alert"
    >
      {/* Icône */}
      <div className="flex-shrink-0">{notificationStyles.Icon}</div>

      {/* Message */}
      <div className="flex-grow">
        <p className="font-medium">{message}</p>
      </div>

      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="ml-4 -mr-2 -my-2 p-1.5 rounded-md hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current"
        aria-label="Fermer"
      >
        <XCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
