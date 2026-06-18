import { FiAlertCircle } from "react-icons/fi";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center animate-fadeIn">
      <p className="font-medium flex items-center justify-center gap-2">
        <FiAlertCircle /> {message}
      </p>
    </div>
  );
}