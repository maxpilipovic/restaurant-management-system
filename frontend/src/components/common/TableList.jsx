import React from "react";

const TableList = ({ tables, workers, assignTable }) => {
  const waiters = workers.filter((w) => w.role === "Waiter");

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Tables</h2>
      <div >
        {tables.map((t) => (
          <div
            key={t.id}
          >
            <p>
              <strong>Table {t.number}</strong> — {t.status}
            </p>
            <p>
              Assigned:{" "}
              {t.assigned_waiter
                ? workers.find((w) => w.id === t.assigned_waiter)?.first_name
                : "None"}
            </p>
            <select
              className="border p-2 rounded"
              value={t.assigned_waiter || ""}
              onChange={(e) => assignTable(t.id, Number(e.target.value))}
            >
              <option value="">Unassigned</option>
              {waiters.map((w) => (
                <option key={w.id} value={w.id}>
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