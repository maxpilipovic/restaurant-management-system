import React, { useState, useEffect } from "react";
import WorkerList from "../components/common/WorkerList";
import MenuList from "../components/common/MenuList";
import TableList from "../components/common/TableList";
import AddWorkerForm from "../components/common/AddWorkerForm";

export const PageManager = () => {
  // Workers
  const [workers, setWorkers] = useState([]);
  const [tables, setTables] = useState([]);

  //Menu items
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Burger", price: 12.99, is_special: false },
    { id: 2, name: "Pizza", price: 15.49, is_special: true },
    { id: 3, name: "Pasta", price: 11.0, is_special: false },
  ]);

  //Grab menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/menu_items');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items for manager page', error);
      }
    };
    fetchMenuItems();
  }, []);

  //Grabs users and tables
  useEffect(() => {
        const fetchData = async () => {
          try {
            const tablesResponse = await fetch('http://localhost:3001/api/tables');
            const tablesData = await tablesResponse.json();
            setTables(tablesData);
  
            const workersResponse = await fetch('http://localhost:3001/api/users');
            const workersData = await workersResponse.json();
            setWorkers(workersData);
          } catch (error) {
            console.error('Error getting tables & workers for host page', error);
          }
        };
        fetchData();
      }, []);

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

  //This needs to be looked at? Should we delete roles???
  const removeWorker = (id) => {
    // setWorkers(workers.filter((w) => w.id !== id));
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