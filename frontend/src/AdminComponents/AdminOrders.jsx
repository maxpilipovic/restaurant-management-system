import React from 'react';

const AdminOrders = ({ orders }) => {
  return (
    <section className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      <div className="grid grid-cols-3 gap-4">
        {orders.map(o => (
          <div key={o.order_id} className="p-4 border rounded-lg hover:shadow-md transition">
            <p className="font-medium">Order #{o.order_id}</p>
            <p className="text-sm text-gray-600">Table: {o.table_id}</p>
            <p className={`text-sm font-semibold ${
              o.order_status === 'Pending' ? 'text-red-500' :
              o.order_status === 'In Progress' ? 'text-yellow-500' :
              'text-green-600'
            }`}>
              Status: {o.order_status}
            </p>
            <ul className="mt-2 text-sm text-gray-700">
              {o.items?.map((item, idx) => (
                <li key={idx}>- {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminOrders;