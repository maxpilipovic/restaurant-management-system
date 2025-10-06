import React from "react";

const TableList = ({ tables, workers, assignTable }) => {
  //const waiters = workers.filter((w) => w.role === "Waiter");

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Tables</h2>
      <div >
        {tables.map((t) => (
          <div
            key={t.table_id}
          >
            <p>
              <strong>Table {t.table_number}</strong> — {t.status}
            </p>
            <p>
              Assigned:{" "}
              {t.assigned_waiter_id
                ? workers.find((w) => w.user_id === t.assigned_waiter_id)?.first_name
                : "None"}
            </p>
            <select
              className="border p-2 rounded"
              value={t.assigned_waiter_id || ""}
              onChange={(e) => assignTable(t.table_id, Number(e.target.value))}
            >
              <option value="">Unassigned</option>
              {workers.map((w) => (
                <option key={w.user_id} value={w.user_id}>
                  {w.first_name} {w.last_name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TableList;