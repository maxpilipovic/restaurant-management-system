import React, { useState } from "react";

// Reusable Card Component
const InfoCard = ({ title, children }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

const PageOwner = () => {
  // Workers (same as Manager)
  const [workers, setWorkers] = useState([
    { id: 1, first_name: "Alice", last_name: "Johnson", role: "Waiter" },
    { id: 2, first_name: "Bob", last_name: "Smith", role: "Waiter" },
    { id: 3, first_name: "Carol", last_name: "Davis", role: "Host" },
  ]);

  // Managers (Owner can add/remove)
  const [managers, setManagers] = useState([
    { id: 1, name: "David" },
    { id: 2, name: "Emma" },
  ]);

  // Tables
  const [tables, setTables] = useState([
    { id: 1, number: 1, status: "Open", assigned_waiter: null },
    { id: 2, number: 2, status: "Occupied", assigned_waiter: 1 },
    { id: 3, number: 3, status: "Open", assigned_waiter: null },
    { id: 4, number: 4, status: "Open", assigned_waiter: null },
    { id: 5, number: 5, status: "Open", assigned_waiter: null },
    { id: 6, number: 6, status: "Open", assigned_waiter: null },
    { id: 7, number: 7, status: "Open", assigned_waiter: null },
    { id: 8, number: 8, status: "Open", assigned_waiter: null },
    { id: 9, number: 9, status: "Open", assigned_waiter: null },
    { id: 10, number: 10, status: "Open", assigned_waiter: null },
  ]);

  // Menu Items
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Burger", price: 12.99, is_special: false },
    { id: 2, name: "Pizza", price: 15.49, is_special: true },
    { id: 3, name: "Pasta", price: 11.0, is_special: false },
  ]);

  // Reports (example data)
  const [reports] = useState([
    { item: "Burger", quantity: 25, revenue: 250 },
    { item: "Pizza", quantity: 15, revenue: 180 },
    { item: "Pasta", quantity: 10, revenue: 120 },
  ]);

  // --- Worker functions ---
  const addWorker = (first_name, last_name, role) => {
    const newWorker = { id: workers.length + 1, first_name, last_name, role };
    setWorkers([...workers, newWorker]);
  };

  const removeWorker = (id) => {
    setWorkers(workers.filter((w) => w.id !== id));
  };

  // --- Manager functions ---
  const addManager = () => {
    const name = prompt("Enter manager name:");
    if (name) setManagers([...managers, { id: managers.length + 1, name }]);
  };

  const removeManager = (id) => {
    setManagers(managers.filter((m) => m.id !== id));
  };

  // --- Table functions ---
  const assignTable = (tableId, waiterId) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, assigned_waiter: waiterId } : t))
    );
  };

  // --- Menu functions ---
  const addMenuItem = (name, price) => {
    const newItem = { id: menuItems.length + 1, name, price, is_special: false };
    setMenuItems([...menuItems, newItem]);
  };

  const removeMenuItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const changePrice = (id, newPrice) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const toggleSpecial = (id) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_special: !item.is_special } : item))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md">Admin</button>
        <button className="bg-yellow-500 text-white px-3 py-1 rounded-md">Menu</button>
        <button className="bg-green-500 text-white px-3 py-1 rounded-md">Reports</button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Managers */}
        <InfoCard title="Managers">
          <ul className="mb-2">
            {managers.map((m) => (
              <li key={m.id} className="flex justify-between items-center mb-1">
                {m.name}
                <button
                  className="bg-red-500 text-white px-2 py-0.5 rounded text-sm"
                  onClick={() => removeManager(m.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md" onClick={addManager}>
            Add Manager
          </button>
        </InfoCard>

        {/* Reports */}
        <InfoCard title="Reports">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b pb-1">Item</th>
                <th className="border-b pb-1">Quantity</th>
                <th className="border-b pb-1">Revenue ($)</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, idx) => (
                <tr key={idx}>
                  <td className="border-b py-1">{r.item}</td>
                  <td className="border-b py-1">{r.quantity}</td>
                  <td className="border-b py-1">{r.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfoCard>

        {/* Workers */}
        <InfoCard title="Workers">
          <ul className="mb-2">
            {workers.map((w) => (
              <li key={w.id}>
                {w.first_name} {w.last_name} ({w.role})
                <button
                  className="bg-red-500 text-white px-2 py-0.5 rounded text-sm ml-2"
                  onClick={() => removeWorker(w.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2"
            onClick={() => {
              const first_name = prompt("First name:");
              const last_name = prompt("Last name:");
              const role = prompt("Role:");
              if (first_name && last_name && role) addWorker(first_name, last_name, role);
            }}
          >
            Add Worker
          </button>
        </InfoCard>

        {/* Menu Items */}
        <InfoCard title="Menu">
          <ul className="mb-2">
            {menuItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-1">
                {item.name} (${item.price.toFixed(2)})
                <div className="flex gap-1">
                  <button
                    className="bg-yellow-500 text-white px-2 py-0.5 rounded text-sm"
                    onClick={() => {
                      const newPrice = parseFloat(prompt("New price:"));
                      if (!isNaN(newPrice)) changePrice(item.id, newPrice);
                    }}
                  >
                    Change Price
                  </button>
                  <button
                    className={`px-2 py-0.5 rounded text-sm ${
                      item.is_special ? "bg-green-500 text-white" : "bg-gray-300"
                    }`}
                    onClick={() => toggleSpecial(item.id)}
                  >
                    Special
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-0.5 rounded text-sm"
                    onClick={() => removeMenuItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md"
            onClick={() => {
              const name = prompt("Menu item name:");
              const price = parseFloat(prompt("Price:"));
              if (name && !isNaN(price)) addMenuItem(name, price);
            }}
          >
            Add Menu Item
          </button>
        </InfoCard>
      </div>
    </div>
  );
};

export default PageOwner;
