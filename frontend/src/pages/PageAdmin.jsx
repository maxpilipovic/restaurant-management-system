import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminUsers from '../AdminComponents/AdminUsers.jsx';
import AdminTables from '../AdminComponents/AdminTables.jsx';
import AdminOrders from '../AdminComponents/AdminOrders.jsx';
import AdminMenuItems from '../AdminComponents/AdminMenuItems.jsx';

//STILL HAVE TO CHECK ROLE ON EACH PAGE

export const PageAdmin = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [usersRes, tablesRes, ordersRes, menuRes, rolesRes] = await Promise.all([
          fetch('http://localhost:3001/api/users'),
          fetch('http://localhost:3001/api/tables'),
          fetch('http://localhost:3001/api/orders'),
          fetch('http://localhost:3001/api/menu_items'),
          fetch('http://localhost:3001/api/roles')
        ]);

        setUsers(await usersRes.json());
        setTables(await tablesRes.json());
        setOrders(await ordersRes.json());
        setMenuItems(await menuRes.json());
        setRoles(await rolesRes.json());
      } catch (err) {
        console.error('Error fetching admin data:', err);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="p-6 text-gray-600">Loading admin dashboard...</div>;
  if (!user) return <div className="p-6 text-red-600">Please log in to access the admin panel.</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>

      <AdminUsers users={users} roles={roles} />
      <AdminTables tables={tables} />
      <AdminOrders orders={orders} />
      <AdminMenuItems menuItems={menuItems} />
    </div>
  );
};

export default PageAdmin;