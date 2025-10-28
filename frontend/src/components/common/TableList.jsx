import React from "react";

const TableList = ({ tables, workers, orders, assignTable }) => {
  //const waiters = workers.filter((w) => w.role === "Waiter");

  //FIX THIS WITH TOAST NOTIFICATIONS INSTEAD OF ALERTS!!!
  const handlePayment = async (table) => {
    // Logic to handle payment

    //Find other orders for the table
    const order = orders.find(
      (o) => o.table_id === table.table_id && table.status === "Occupied"
    )

    if (!order) {
      alert("No order with this table");
    }

    //If it exists, proceed with payment post request.
    try {
      const response = await fetch(`http://localhost:3001/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: order.order_id,
          payment_method: 'Credit Card',
          amount: 100,
          payment_time: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        alert("Error processing payment");
      }

      //Update table status to Open
      const tableResponse = await fetch(`http://localhost:3001/api/tables/${table.table_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Open" }),
      });

      if (!tableResponse.ok) {
        alert("Error updating table status");
      }

      if (response.ok && tableResponse.ok)
      {
        alert("Payment successful!");
      }

    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };


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
            <div className="flex">
              <button
                className="mt-2 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handlePayment(t)}
              >
                Pay
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TableList;