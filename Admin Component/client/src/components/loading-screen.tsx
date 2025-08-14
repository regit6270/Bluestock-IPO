import { TrendingUp } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-bluestock-light flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-bluestock-primary to-bluestock-secondary rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            BLUESTOCK<span className="text-sm align-top">™</span>
          </h1>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 border-4 border-bluestock-primary/20 border-t-bluestock-primary rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-bluestock-gray text-lg mb-2">Loading...</p>
        <p className="text-gray-500 text-sm">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  );
}