import React from "react";

const ChefCard = ({ order, onUpdateStatus, onPrioritize }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-2">Table {order.table}</h2>
        <ul className="text-sm mb-3">
          {order.items.map((item, index) => (
            <li key={index}>- {item}</li>
          ))}
        </ul>
        <p
          className={`font-semibold mb-3 ${
            order.status === "Pending"
              ? "text-red-500"
              : order.status === "In Progress"
              ? "text-yellow-500"
              : "text-green-600"
          }`}
        >
          Status: {order.status}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
          onClick={() => onPrioritize(order.id)}
        >
          Prioritize
        </button>
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
          onClick={() => onUpdateStatus(order.id, "In Progress")}
        >
          In Progress
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
          onClick={() => onUpdateStatus(order.id, "Done")}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ChefCard;
