import React, { use } from 'react';
import {useState, useEffect} from "react";
import WorkerList from "../components/common/WorkerList";
import MenuList from "../components/common/MenuList";
import { useAuth } from "../contexts/AuthContext";
import LoadingPage from "../common/loadingPage";
import ErrorPage from "../common/errorPage";

export const PageOwner = () => {

  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState(null);
  const [hostName, setHostName] = useState("");
  const [workers, setWorkers] = useState([]);
  const [roles, setRoles] = useState([]);

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
          //Double check what owner is in db
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
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      {/* Workers Section */}
      <WorkerList
        workers={workers}
        roles={roles}
        removeWorker={removeWorker}
        updateWorkerRole={updateWorkerRole}
      />

      <h1 className="text-3xl font-bold mt-8">Reports</h1>
    </div>
  );
};

export default PageOwner;