import React from 'react';

const AdminTables = ({ tables }) => {
  return (
    <section className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Tables</h2>
      <div className="grid grid-cols-5 gap-4">
        {tables.map(t => (
          <div
            key={t.table_id}
            className={`p-4 border rounded-lg text-center ${
              t.status === 'Open' ? 'bg-green-50' :
              t.status === 'Occupied' ? 'bg-red-50' :
              'bg-red-50'
            }`}
          >
            <p className="font-medium">Table {t.table_number}</p>
            <p className="text-sm text-gray-600">Status: {t.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminTables;