import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabase';

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
  // --- State ---
  const [workers, setWorkers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reports, setReports] = useState([]);

  // --- Fetch data on component mount ---
  useEffect(() => {
    fetchWorkers();
    fetchManagers();
    fetchTables();
    fetchMenuItems();
  }, []);

  // --- Workers ---
  const fetchWorkers = async () => {
    const { data, error } = await supabase.from("workers").select("*");
    if (error) console.error("Fetch workers error:", error);
    else setWorkers(data);
  };

  const addWorker = async (first_name, last_name, role) => {
    const { data, error } = await supabase
      .from("workers")
      .insert([{ first_name, last_name, role }])
      .select();
    if (error) console.error("Add worker error:", error);
    else setWorkers((prev) => [...prev, ...data]);
  };

  const removeWorker = async (id) => {
    const { error } = await supabase.from("workers").delete().eq("id", id);
    if (error) console.error("Delete worker error:", error);
    else setWorkers((prev) => prev.filter((w) => w.id !== id));
  };

  // --- Managers ---
  const fetchManagers = async () => {
    const { data, error } = await supabase.from("managers").select("*");
    if (error) console.error("Fetch managers error:", error);
    else setManagers(data);
  };

  const addManager = async () => {
    const name = prompt("Enter manager name:");
    if (!name) return;
    const { data, error } = await supabase.from("managers").insert([{ name }]).select();
    if (error) console.error("Add manager error:", error);
    else setManagers((prev) => [...prev, ...data]);
  };

  const removeManager = async (id) => {
    const { error } = await supabase.from("managers").delete().eq("id", id);
    if (error) console.error("Delete manager error:", error);
    else setManagers((prev) => prev.filter((m) => m.id !== id));
  };

  // --- Tables ---
  const fetchTables = async () => {
    const { data, error } = await supabase.from("tables").select("*");
    if (error) console.error("Fetch tables error:", error);
    else setTables(data);
  };

  const assignTable = async (tableId, waiterId) => {
    const { error } = await supabase
      .from("tables")
      .update({ assigned_waiter: waiterId })
      .eq("id", tableId);
    if (error) console.error("Assign table error:", error);
    else setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, assigned_waiter: waiterId } : t))
    );
  };

  // --- Menu Items ---
  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from("menu_items").select("*");
    if (error) console.error("Fetch menu items error:", error);
    else setMenuItems(data);
  };

  const addMenuItem = async (name, price) => {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([{ name, price, is_special: false }])
      .select();
    if (error) console.error("Add menu item error:", error);
    else setMenuItems((prev) => [...prev, ...data]);
  };

  const removeMenuItem = async (id) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) console.error("Delete menu item error:", error);
    else setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const changePrice = async (id, newPrice) => {
    const { error } = await supabase.from("menu_items").update({ price: newPrice }).eq("id", id);
    if (error) console.error("Change price error:", error);
    else setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const toggleSpecial = async (id) => {
    const item = menuItems.find((i) => i.id === id);
    if (!item) return;
    const { error } = await supabase
      .from("menu_items")
      .update({ is_special: !item.is_special })
      .eq("id", id);
    if (error) console.error("Toggle special error:", error);
    else setMenuItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, is_special: !i.is_special } : i))
    );
  };

  // --- Reports (example, can be dynamic later) ---
  useEffect(() => {
    const reportData = menuItems.map((item) => ({
      item: item.name,
      quantity: Math.floor(Math.random() * 20), // example quantity
      revenue: item.price * Math.floor(Math.random() * 20),
    }));
    setReports(reportData);
  }, [menuItems]);

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

