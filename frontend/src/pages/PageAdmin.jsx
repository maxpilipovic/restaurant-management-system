import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminUsers from '../AdminComponents/AdminUsers.jsx';
import AdminTables from '../AdminComponents/AdminTables.jsx';
import AdminOrders from '../AdminComponents/AdminOrders.jsx';
import AdminMenuItems from '../AdminComponents/AdminMenuItems.jsx';

//STILL HAVE TO CHECK ROLE ON EACH PAGE

export const PageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [hostName, setHostName] = useState("");
  const [authorized, setAuthorized] = useState(null);

  //Auth
  const { user, loading } = useAuth();

  useEffect(() => {
      
      //Check if metadata exists
      if (!user) {
        return;
      }
  
      const checkAccess = async () => {
        try {
          const usersResponse = await fetch('http://localhost:3001/api/users');
          const usersData = await usersResponse.json();
          setUsers(usersData);

          const currentUser = usersData.find(w => w.email === user.user_metadata.email);

          //Check if host or admin
          if (currentUser && currentUser.role_id === 6) {
            setAuthorized(true);
            setHostName(currentUser.first_name + " " + currentUser.last_name);
  
            const [tablesRes, ordersRes, menuRes, rolesRes] = await Promise.all([
              fetch('http://localhost:3001/api/tables'),
              fetch('http://localhost:3001/api/orders'),
              fetch('http://localhost:3001/api/menu_items'),
              fetch('http://localhost:3001/api/roles')
            ]);
            
            setTables(await tablesRes.json());
            setOrders(await ordersRes.json());
            setMenuItems(await menuRes.json());
            setRoles(await rolesRes.json());
          }
          else  {
            setAuthorized(false);
            console.log("Not authorized, lowkey");
          }
        } catch (error) {
          console.error("Error checking access for host page and loading in stuff", error);
          setAuthorized(false);
        }
      };
  
      checkAccess();
    }, [user]);

  if (loading) return <div className="p-6 text-gray-600">Loading admin dashboard...</div>;

  //Display error page
  if (!authorized) {
    return (
      <div className="p-6 text-red-600 font-bold text-xl">
        Access denied. You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, {hostName}
        </h1>
      </div>
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>

      <AdminUsers users={users} roles={roles} />
      <AdminTables tables={tables} />
      <AdminOrders orders={orders} />
      <AdminMenuItems menuItems={menuItems} />
    </div>
  );
};

export default PageAdmin;