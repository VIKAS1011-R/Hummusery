"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { Toast as ToastType, useToast } from "../context/ToastContext";

interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      case "info":
        return "border-blue-500";
      default:
        return "border-gray-500";
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between p-4 mb-3 bg-gray-800 border-l-4 ${getBorderColor()} 
        rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
        min-w-[320px] max-w-[400px]
      `}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <span className="text-white text-sm font-medium">{toast.message}</span>
      </div>

      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-white transition-colors duration-200 ml-4"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
