import React from 'react';

export const HostCard = ({ table, workers, updateStatus }  ) => {

  const toggleStatus = () => {
    const newStatus = table.status === "Open" ? "Occupied" : "Open";
    updateStatus(table.table_id, newStatus);
  }

  return (
    <div
      className={`p-6 border rounded-xl shadow-sm text-center transition-all duration-200 ${
        table.status === "Open"
          ? "bg-green-50 hover:shadow-md"
          : "bg-red-50 hover:shadow-md"
      }`}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Table {table.table_number}
      </h3>

      <p
        className={`text-sm font-medium mb-3 ${
          table.status === "Open" ? "text-green-600" : "text-red-600"
        }`}
      >
        Status: {table.status}
      </p>

      <p className="text-gray-700 mb-4">
        Assigned:{" "}
        <span className="font-medium">
          {table.assigned_waiter_id
            ? workers.find(
                (w) => w.user_id === table.assigned_waiter_id
              )?.first_name
            : "None"}
        </span>
      </p>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
        onClick={toggleStatus}
      >
        Change Status
      </button>
    </div>
  );
};

export default HostCard;