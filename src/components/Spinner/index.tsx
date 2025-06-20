import type React from "react";

interface SpinnerProps {
  caption: string;
}

const Spinner: React.FC<SpinnerProps> = ({ caption }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-black">{caption}</p>
    </div>
  );
};

export default Spinner;
