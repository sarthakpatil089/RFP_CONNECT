import React from "react";
import { Toast, useToast } from "../../context/toastContext";
import { X, CircleAlert, TriangleAlert, CircleCheck } from "lucide-react";

const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  const { removeToast } = useToast();

  React.useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    toasts.forEach((toast) => {
      const timeout = setTimeout(() => removeToast(toast.id), 4000);
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-16 w-fit p-4 shadow-lg border-l-4 flex items-center animate-in slide-in-from-top-2 duration-300 ${
            toast.type === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : toast.type === "error"
              ? "bg-red-50 border-red-500 text-red-800"
              : "bg-yellow-50 border-yellow-500 text-yellow-800"
          }`}
        >
          <span className="mr-2">
            {toast.type === "success" ? (
              <CircleCheck />
            ) : toast.type === "error" ? (
              <CircleAlert />
            ) : (
              <TriangleAlert />
            )}
          </span>
          <span className="flex-1 font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 p-1 hover:bg-opacity-20 hover:bg-white rounded-full"
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
