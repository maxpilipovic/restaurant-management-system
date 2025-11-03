import React from 'react';

// Reusable Table Card
const TableCard = ({ tableNumber, status }) => {

  const getStatusStyles = () => {
    switch (status) {
      case 'Open':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Occupied':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'In progress':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        //Just in case default if there is error in db
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div
      className={`p-6 border !border-black rounded-xl shadow-sm text-center transition-all duration-200 hover:shadow-md cursor-pointer ${getStatusStyles()}`}
    >
      <h3 className="text-xl font-semibold mb-2">
        Table {tableNumber}
      </h3>

      <p className="text-sm font-medium">
        Status: <span className="capitalize">{status}</span>
      </p>

    </div>
  );
};

export default TableCard;