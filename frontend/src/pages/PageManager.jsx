import React, { useState } from "react";
import WorkerList from "../components/common/WorkerList";
import MenuList from "../components/common/MenuList";
import TableList from "../components/common/TableList";
import AddWorkerForm from "../components/common/AddWorkerForm";

export const PageManager = () => {
  // Workers
  const [workers, setWorkers] = useState([
    { id: 1, first_name: "Alice", last_name: "Johnson", role: "Waiter" },
    { id: 2, first_name: "Bob", last_name: "Smith", role: "Waiter" },
    { id: 3, first_name: "Carol", last_name: "Davis", role: "Host" },
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
    { id: 10, number: 10, status: "Open", assigned_waiter: null }
  ]);

  //Menu items
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Burger", price: 12.99, is_special: false },
    { id: 2, name: "Pizza", price: 15.49, is_special: true },
    { id: 3, name: "Pasta", price: 11.0, is_special: false },
  ]);

  //Worker stuff
  const addWorker = (first_name, last_name, role) => {
    const newWorker = {
      id: workers.length + 1,
      first_name,
      last_name,
      role,
    };
    setWorkers([...workers, newWorker]);
  };

  const removeWorker = (id) => {
    setWorkers(workers.filter((w) => w.id !== id));
  };

  //Table stuff
  const assignTable = (tableId, waiterId) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, assigned_waiter: waiterId } : t
      )
    );
  };

  //Menu stuff
  const addMenuItem = (name, price) => {
    const newItem = {
      id: menuItems.length + 1,
      name,
      price,
      is_special: false,
    };
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
      prev.map((item) =>
        item.id === id ? { ...item, is_special: !item.is_special } : item
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      {/* Workers Section */}
      <WorkerList
        workers={workers}
        addWorker={addWorker}
        removeWorker={removeWorker}
      />
      <h1>Test</h1>
      {/* Tables Section */}
      <TableList
        tables={tables}
        workers={workers}
        assignTable={assignTable}
      />

      {/* Menu Section */}
      <MenuList
        menuItems={menuItems}
        addMenuItem={addMenuItem}
        removeMenuItem={removeMenuItem}
        changePrice={changePrice}
        toggleSpecial={toggleSpecial}
      />

    </div>
  );
};

export default PageManager;