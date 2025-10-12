import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import HostCard from '../components/common/HostCard';
import LoadingPage from '../common/loadingPage';
import ErrorPage from '../common/errorPage';

//STILL HAVE TO CHECK ROLE ON EACH PAGE

export const PageHost = () => {

  const { user,loading } = useAuth(); 

  //hardcoded data
  const [tables, setTables] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [hostName, setHostName] = useState("");
  const [authorized, setAuthorized] = useState(null);

  //useEffect to pull data
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
        //Host is 2?
        if (currentUser && (currentUser.role_id === 2 || currentUser.role_id === 6)) {
          setAuthorized(true);
          setHostName(currentUser.first_name + " " + currentUser.last_name);

          const tablesResponse = await fetch('http://localhost:3001/api/tables');
          const tablesData = await tablesResponse.json();
          setTables(tablesData);
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
  
  //Update status function for tables
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

  //Loading page
  if (loading) {
    return <LoadingPage />;
  }

  //Error page
  if (!authorized || authorized === null) {
    return <ErrorPage message="You are not authorized to view this page." />;
  }

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