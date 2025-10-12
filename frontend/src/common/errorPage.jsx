// src/components/common/ErrorPage.jsx
import React from "react";

const ErrorPage = ({ title = "Access Denied", message }) => {

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-800 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-blue-200">
        <h1 className="text-4xl font-bold mb-2 text-blue-700">{title}</h1>
        <p className="text-blue-600 mb-6">{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;