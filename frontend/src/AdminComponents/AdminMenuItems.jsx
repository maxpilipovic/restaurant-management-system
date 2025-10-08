import React from 'react';

const AdminMenuItems = ({ menuItems }) => {
  return (
    <section className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
      <div className="grid grid-cols-4 gap-4">
        {menuItems.map(m => (
          <div key={m.item_id} className="p-4 border rounded-lg hover:shadow-md transition">
            <p className="font-medium">{m.name}</p>
            <p className="text-sm text-gray-600">Price: ${m.price.toFixed(2)}</p>
            {m.is_special && <p className="text-green-600 text-sm font-semibold">Special</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminMenuItems;