import React from "react";

const ChefCard = ({ order, onUpdateStatus }) => {
  return (
    <div
      className={`p-6 border rounded-xl shadow-sm text-center transition-all duration-200 hover:shadow-md ${
        order.status === "Pending"
          ? "bg-red-50"
          : order.status === "In Progress"
          ? "bg-yellow-50"
          : "bg-green-50"
      }`}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Table {order.table}
      </h3>

      <ul className="text-gray-700 text-sm mb-4 text-left list-disc list-inside">
        {order.items.map((item, index) => (
          <li key={index} className="mb-1">
            {item}
          </li>
        ))}
      </ul>

      <p
        className={`font-medium mb-4 ${
          order.status === "Pending"
            ? "text-red-600"
            : order.status === "In Progress"
            ? "text-yellow-600"
            : "text-green-600"
        }`}
      >
        Status: {order.status}
      </p>

      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={() => onUpdateStatus(order.id, "In Progress")}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition-all"
        >
          In Progress
        </button>
        <button
          onClick={() => onUpdateStatus(order.id, "Done")}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};


export default ChefCard;
