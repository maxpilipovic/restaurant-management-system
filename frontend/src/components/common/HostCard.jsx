import React from 'react';

export const HostCard = ({ table, updateStatus }  ) => {

  const toggleStatus = () => {
    const newStatus = table.status === "Open" ? "Occupied" : "Open";
    updateStatus(table.id, newStatus);
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-2">Table {table.table}</h2>
        <p
          className={`font-semibold mb-3 ${
            table.status === "Open"
              ? "text-green-500"
              : "text-red-600"
          }`}
        >
          Status: {table.status}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-lg font-medium" onClick={toggleStatus}>
          Change Status
        </button>
      </div>
    </div>
  );
};

export default HostCard;