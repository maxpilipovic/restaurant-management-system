import React from 'react';
import { useState } from 'react';
import HostCard from '../components/common/HostCard';

export const PageHost = () => {

    //hardcoded data
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

    const [workers, setWorkers] = useState([
        { id: 1, first_name: "Alice", last_name: "Johnson", role: "Waiter" },
        { id: 2, first_name: "Bob", last_name: "Smith", role: "Waiter" },
        { id: 3, first_name: "Carol", last_name: "Davis", role: "Host" },
      ]);

    const updateStatus = (id, newStatus) => {
      setTables((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
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