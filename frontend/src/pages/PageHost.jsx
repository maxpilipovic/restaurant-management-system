import React from 'react';
import { useState } from 'react';
import HostCard from '../components/common/HostCard';

export const PageHost = () => {

    //hardcoded data
    const [tables, setTables] = useState([
        { id: 1, table: 1, status: "Open" },
        { id: 2, table: 2, status: "Open" },
        { id: 3, table: 3, status: "Open" },
        { id: 4, table: 4, status: "Open" },
        { id: 5, table: 5, status: "Open" },
        { id: 6, table: 6, status: "Open" },
        { id: 7, table: 7, status: "Open" },
        { id: 8, table: 8, status: "Open" },
        { id: 9, table: 9, status: "Open" },
        { id: 10, table: 10, status: "Occupied" }
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
            updateStatus={updateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default PageHost;