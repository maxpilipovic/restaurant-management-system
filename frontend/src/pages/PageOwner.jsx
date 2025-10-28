import React, { use } from 'react';
import {useState, useEffect} from "react";
import WorkerList from "../components/common/WorkerList";
import MenuList from "../components/common/MenuList";
import { useAuth } from "../contexts/AuthContext";
import LoadingPage from "../common/loadingPage";
import ErrorPage from "../common/errorPage";
import Reports from '../components/common/Reports';
import Tabs from '../components/layout/Tabs';

export const PageOwner = () => {

  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState(null);
  const [hostName, setHostName] = useState("");
  const [workers, setWorkers] = useState([]);
  const [roles, setRoles] = useState([]);

  //Stuff specifically for reports
  const [payments, setPayments] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
      
      //Check if metadata exists
      if (!user) {
        return;
      }
  
      const checkAccess = async () => {
        try {
          const workersResponse = await fetch('http://localhost:3001/api/users');
          const workersData = await workersResponse.json();
          setWorkers(workersData);

          const currentUser = workersData.find(w => w.email === user.user_metadata.email);
  
          //Check if host or admin
          if (currentUser && (currentUser.role_id === 5 || currentUser.role_id === 6)) {
            setAuthorized(true);
            setHostName(currentUser.first_name + " " + currentUser.last_name);
  
            const tablesResponse = await fetch('http://localhost:3001/api/tables');
            const tablesData = await tablesResponse.json();
          }
          else  {
            setAuthorized(false);
            console.log("Not authorized, lowkey");
          }
        } catch (error) {
          console.error("Error checking access for host page", error);
          setAuthorized(false);
        }
      };
  
      checkAccess();
    }, [user]);

    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/roles');
          const data = await response.json();
          setRoles(data);
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };
  
      fetchRoles();
    }, []);

    //Get payments
    useEffect(() => {
      const fetchPayments = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/getpayments');
          const data = await response.json();
          setPayments(data);
        } catch (error) {
          console.error("Error fetching payments:", error);
        }
      };
  
      fetchPayments();
    }, []);

    //Get order items
    useEffect(() => {
      const fetchOrderItems = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/order-items');
          const data = await response.json();
          setOrderItems(data);
        } catch (error) {
          console.error("Error fetching order items:", error);
        }
      };
  
      fetchOrderItems();
    }, []);

    //Get menu items
    useEffect(() => {
      const fetchMenuItems = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/get_menu');
          const data = await response.json();
          setMenuItems(data);
        } catch (error) {
          console.error("Error fetching menu items:", error);
        }
      };
  
      fetchMenuItems();
    }, []);

    //Get order items
    useEffect(() => {
      const fetchOrderItems = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/get_order_items');
          const data = await response.json();
          setOrderItems(data);
        } catch (error) {
          console.error("Error fetching order items:", error);
        }
      };
  
      fetchOrderItems();
    }, []);

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

  if (loading || authorized === null) {
    return <LoadingPage />;
  }

  if (!authorized) {
    return <ErrorPage message="You are not authorized to view this page." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, {hostName}
        </h1>
      </div>
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>

      <Tabs
        children={[
          {
            label: "Workers",
            content: (
              <WorkerList
                workers={workers}
                roles={roles}
                removeWorker={removeWorker}
                updateWorkerRole={updateWorkerRole}
              />
            )
          },
          {
            label: "Reports",
            content: (
              <Reports 
                payments={payments}
                orderItems={orderItems}
                menuItems={menuItems}
              />
            )
          },
        ]}
      />
    </div>
  );
};

export default PageOwner;