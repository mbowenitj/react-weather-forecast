import { FiLoader } from "react-icons/fi";

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center animate-fadeIn">
        <FiLoader className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" />
        <p className="text-gray-500">Fetching weather data...</p>
      </div>
    </div>
  );
}