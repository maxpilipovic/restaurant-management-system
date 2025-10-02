import React from 'react';
import { useState, useEffect } from 'react';
import HostCard from '../components/common/HostCard';

export const PageHost = () => {

    //hardcoded data
    const [tables, setTables] = useState([]);
    const [workers, setWorkers] = useState([]);


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

    const updateStatus = (id, newStatus) => {
      setTables((prev) =>
        prev.map((table) =>
          table.table_id === id ? { ...table, status: newStatus } : table
        )
      );
    };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tables</h1>
      <div className="grid grid-cols-5 gap-x-12 gap-y-6">
        {tables.map((table) => (
          <HostCard
            key={table.id}
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