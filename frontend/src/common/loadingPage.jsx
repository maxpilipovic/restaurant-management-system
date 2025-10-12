import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-800">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
      <p className="text-blue-600 mt-2">LOADING</p>
    </div>
  );
};

export default LoadingPage;