import React from "react";

const WorkerList = ({ workers, removeWorker, updateWorkerRole, roles }) => {

  const getRoleName = (role_id) => {
    const role = roles.find((r) => r.role_id === role_id);
    return role ? role.role_name : "Unknown";
  };

  return (
    <section className="mb-10">
      <h2 className="font-bold mb-4">Workers</h2>

      <ul>
        {workers.map((w) => (
          <li
            key={w.user_id}
            className="flex justify-between items-center mb-2"
          >
            <div className="flex items-center gap-4">
              <span>{w.first_name} {w.last_name} {getRoleName(w.role_id)}</span>

              {/* Role dropdown */}
              <select
                value={w.role_id}
                onChange={(e) =>
                  updateWorkerRole(w.user_id, Number(e.target.value))
                }
                className="border p-1 rounded"
              >
                {roles.map((r) => (
                  <option key={r.role_id} value={r.role_id}>
                    {r.role_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Remove button */}
            <button
              className="text-red-600 underline"
              onClick={() => removeWorker(w.user_id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WorkerList;
