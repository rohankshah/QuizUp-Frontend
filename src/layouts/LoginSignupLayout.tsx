"use client";

import { CheckCircle } from "lucide-react";
import { ReactNode } from "react";

interface LoginSignupLayoutProps {
  heading: string;
  subHeading: string;
  children: ReactNode;
}
const LoginSignupLayout: React.FC<LoginSignupLayoutProps> = ({
  heading,
  subHeading,
  children,
}) => {
  return (
    <div className="flex justify-center items-center h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <CheckCircle className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {heading}
            </h2>
            <p className="text-gray-500">{subHeading}</p>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupLayout;
