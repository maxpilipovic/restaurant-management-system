import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import HostCard from '../components/common/HostCard';

//STILL HAVE TO CHECK ROLE ON EACH PAGE

export const PageHost = () => {

  const { user,loading } = useAuth(); 

  //hardcoded data
  const [tables, setTables] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [hostName, setHostName] = useState("");
    
  //Grab hostname
  useEffect(() => {
    if (user) {
      // Grab the name from user metadata, fallback to email if not set
      console.log("User metadata:", user.user_metadata);
      setHostName(user.user_metadata?.full_name || user.email);
    }
  }, [user]);

  //useEffect to pull data
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
    
  const updateStatus = async (id, newStatus) => {

    //Lets update frontend first lowkey.
    try {
      setTables((prev) =>
        prev.map((table) =>
          table.table_id === id ? { ...table, status: newStatus } : table
        )
      );
        
      //Update backend with put request (TAKE A LOOK AT REST API's) (index.js in backend)
      await fetch(`http://localhost:3001/api/tables/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

    } catch (error) {
      console.error("Error updating table status", error);
      console.log("Failed to update status to:", newStatus);
    }
  };

  // Handle loading/auth
  if (loading) return <div className="p-6 text-gray-600">Loading host dashboard...</div>;
  if (!user) return <div className="p-6 text-red-600">You must be logged in to view this page.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, {hostName}
        </h1>
      </div>

      <h1 className="text-3xl font-bold mb-6">Tables</h1>
      <div className="grid grid-cols-5 gap-x-12 gap-y-6">
        {tables.map((table) => (
          <HostCard
            key={table.table_id}
            table={table}
            workers={workers}
            updateStatus={updateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default PageHost;