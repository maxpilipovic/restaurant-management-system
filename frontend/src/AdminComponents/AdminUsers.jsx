import React from 'react';

const AdminUsers = ({ users, roles }) => {

    const getRoles = (roleId) => {
        const role = roles.find(r => r.role_id === roleId);
        return role ? role.role_name : 'Unknown';
    };
    
  return (
    <section className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <div className="grid grid-cols-3 gap-4">
        {users.map(u => (
          <div key={u.user_id} className="p-4 border rounded-lg hover:shadow-md transition">
            <p className="font-medium">{u.first_name} {u.last_name}</p>
            <p className="text-sm text-gray-600">Role: {getRoles(u.role_id)}</p>
            <p className="text-sm text-gray-500">Email: {u.email}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminUsers;