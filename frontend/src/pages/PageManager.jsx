import React, { useState, useEffect } from "react";
import WorkerList from "../components/common/WorkerList";
import MenuList from "../components/common/MenuList";
import TableList from "../components/common/TableList";
import { useAuth } from "../contexts/AuthContext";

//STILL HAVE TO CHECK ROLE ON EACH PAGE

export const PageManager = () => {
  // Workers
  const [workers, setWorkers] = useState([]);
  const [tables, setTables] = useState([]);
  const [roles, setRoles] = useState([]);

  //Menu items
  const [menuItems, setMenuItems] = useState([]);

  //Grab roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/roles');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles for manager page', error);
      }
    };
    fetchRoles();
  }, []);

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

  //API CALLS
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

  const updateWorkerRole = async (user_id, newRoleId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user_id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_id: newRoleId }),
      });
      const updatedWorker = await response.json();

      setWorkers((prev) =>
        prev.map((w) => (w.user_id === user_id ? updatedWorker[0] : w))
      );
    } catch (error) {
      console.error("Error updating worker role", error);
    }
  };

  //API to FIRE a user... SAFELY DELETE USER
  const removeWorker = async (user_id) => {
    try {
      // 1. Unassign tables assigned to this worker
      await fetch(`http://localhost:3001/api/users/${user_id}/unassign-tables`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      // 2. Delete the user
      await fetch(`http://localhost:3001/api/users/${user_id}`, {
        method: "DELETE",
      });

      // 3. Update frontend state
      setWorkers((prev) => prev.filter((w) => w.user_id !== user_id));
      setTables((prev) =>
        prev.map((t) =>
          t.assigned_waiter_id === user_id ? { ...t, assigned_waiter_id: null } : t
        )
      );

    } catch (error) {
      console.error("Error removing worker", error);
    }
  };

  //const assignTable = async (tableId, waiterId) => {
  const assignTable = async (tableId, waiterId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tables/${tableId}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_waiter_id: waiterId || null }),
      });
      const updatedTable = await response.json();
      console.log(updatedTable);
      setTables((prev) =>
        prev.map((t) => (t.table_id === tableId ? updatedTable[0] : t))
      );
    } catch (error) {
      console.error("Error assigning table", error);
    }
  };

  //MENU API CALLS
  const addMenuItem = async (name, price) => {
    try {
      const response = await fetch("http://localhost:3001/api/menu_items/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price}),
      });
      const newItem = await response.json();
      setMenuItems([...menuItems, newItem]);
    } catch (error) {
      console.error("Error adding menu item", error);
    }
  };

  const removeMenuItem = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/menu_items/${id}/delete_menuitem`, {
        method: "DELETE",
      });
      setMenuItems(prev =>
        prev.filter(item => item.item_id !== id)
      );
    } catch (error) {
      console.error("Error removing menu item", error);
    }
  };

  const changePrice = async (id, newPrice) => {
    try {
      const response = await fetch(`http://localhost:3001/api/menu_items/${id}/change`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: newPrice }),
      });
      const updatedItem = await response.json();
      setMenuItems((prev) =>
        prev.map((item) => (item.item_id === id ? updatedItem : item))
      );
    } catch (error) {
      console.error("Error updating price", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      {/* Workers Section */}
      <WorkerList
        workers={workers}
        roles={roles}
        removeWorker={removeWorker}
        updateWorkerRole={updateWorkerRole}
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
      />

    </div>
  );
};

export default PageManager;