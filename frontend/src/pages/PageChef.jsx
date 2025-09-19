import React, { useState } from "react";
import ChefCard from "../components/common/ChefCard";

export const PageChef = () => {
  const [orders, setOrders] = useState([
    { id: 1, table: 1, items: ["Burger", "Fries"], status: "Pending" },
    { id: 2, table: 2, items: ["Pizza", "Coke"], status: "Pending" },
    { id: 3, table: 3, items: ["Pasta", "Garlic Bread"], status: "Pending" },
    { id: 4, table: 4, items: ["Steak", "Mashed Potatoes"], status: "Pending" },
    { id: 5, table: 5, items: ["Salad", "Water"], status: "Pending" },
    { id: 6, table: 6, items: ["Sushi", "Miso Soup"], status: "Pending" },
    { id: 7, table: 7, items: ["Ramen", "Tea"], status: "Pending" },
    { id: 8, table: 8, items: ["Chicken Wings", "Beer"], status: "Pending" },
    { id: 9, table: 9, items: ["Sandwich", "Juice"], status: "Pending" },
    { id: 10, table: 10, items: ["Tacos", "Soda"], status: "Pending" },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const prioritizeOrder = (id) => {
    setOrders((prev) => {
      const orderToPrioritize = prev.find((o) => o.id === id);
      const others = prev.filter((o) => o.id !== id);
      return [orderToPrioritize, ...others];
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="grid grid-cols-5 gap-6">
        {orders.map((order) => (
          <ChefCard
            key={order.id}
            order={order}
            onUpdateStatus={updateStatus}
            onPrioritize={prioritizeOrder}
          />
        ))}
      </div>
    </div>
  );
};

export default PageChef;
