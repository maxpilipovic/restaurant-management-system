import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoadingPage from "../common/loadingPage.jsx";
import ErrorPage from "../common/errorPage.jsx";
import { useParams, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { user, signOut } = useAuth();
  const { tableId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tip, setTip] = useState(0);
  const [total, setTotal] = useState(0);
  const [authorized, setAuthorized] = useState(null);
  const [waiterId, setWaiterId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        //console.log(user);
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const usersResponse = await fetch("http://localhost:3001/api/users");
        const usersData = await usersResponse.json();

        //console.log("Looking for this email:", user.email);
        const currentUser = usersData.find((u) => u.email === user.email);
        //console.log("Found this user in database:", currentUser);

        if (
          currentUser &&
          (currentUser.role_id === 2 || currentUser.role_id === 6)
        ) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error during authorization check:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user]);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {

        //Find the order for this table
        const ordersRes = await fetch("http://localhost:3001/api/orders");
        const allOrders = await ordersRes.json();
        const openOrder = allOrders.find(
          (o) => o.table_id === Number(tableId) && o.order_status === "Open"
        );
        console.log("Found open order for table:", openOrder);

        if (!openOrder) {
          setError("No open order found for this table");
          return;
        }

        setWaiterId(openOrder.waiter_id);
        setCurrentOrderId(openOrder.order_id);

        //Get items for that order
        const itemsRes = await fetch(
          `http://localhost:3001/api/order_items/${openOrder.order_id}`
        );
        const itemsData = await itemsRes.json();
        console.log("Fetched order items:", itemsData);
        setOrderItems(itemsData);

        //Total amount
        let computedTotal = 0;

        for (const item of itemsData) {
          const isSoda =
            item.category?.toLowerCase().includes("soda") ||
            item.name?.toLowerCase().includes("soda");

          const qty = isSoda ? 1 : item.quantity;
          computedTotal += item.price * qty;
        }

        setTotal(computedTotal);
      } catch (err) {
        console.error("Failed to load order items:", err);
        setError("Failed to load order data");
      } finally {
        //setLoading(false);
      }
    };

    fetchOrderItems();
  }, [tableId]);

  const handleConfirmOrder = async () => {
    if (!currentOrderId) return;

    const finalTotal = total + Number(tip);

    try {
    //Update order
      const res = await fetch(`http://localhost:3001/api/orders/${currentOrderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_id: Number(tableId),
          waiter_id: waiterId,
          order_status: "Completed",
          tip_amount: Number(tip),
          total_amount: finalTotal,
        }),
      });

      //Post request for payments record.
      const res2 = await fetch(`http://localhost:3001/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: currentOrderId,
          payment_method: "Card",
          amount: finalTotal,
          payment_time: new Date().toISOString(),
        }),
      });

      //Handle clearing the table for future orders? (Maybe handled by waiter page.)

      if (res.ok && res2.ok) {
        alert(`Order confirmed! Final total: $${finalTotal.toFixed(2)}`);
        navigate("/waiter");
      } else {
        const msg = await res.text();
        alert("Failed to confirm order: " + msg);
      }
    } catch (err) {
      console.error("Error confirming order:", err);
      alert("Something went wrong while confirming order");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!authorized) {
    return <ErrorPage message="You are not authorized to view this page." />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Payment Page</h1>

      {orderItems.length === 0 ? (
        <p className="text-gray-500 text-center">
          No order created for this table.
        </p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {orderItems.map((item) => (
              <li key={item.id} className="py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">
                      {item.quantity} x {item.name}
                    </p>
                    <p className="text-gray-600">
                      {(() => {
                        let qty = item.quantity;

                        if (
                          item.category?.toLowerCase().includes("soda") ||
                          item.name?.toLowerCase().includes("soda")
                        ) {
                          qty = 1;
                        }

                        return `$${(item.price * qty).toFixed(2)}`;
                      })()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <p className="text-xl font-semibold">
              Subtotal: ${total.toFixed(2)}
            </p>
            <div className="flex justify-end mt-2 gap-2">
              <label className="font-semibold">Tip:</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={tip}
                onChange={(e) => setTip(e.target.value)}
                className="border p-1 rounded w-24 text-center"
              />
            </div>
            <p className="text-xl font-bold mt-4">
              Total: ${(total + Number(tip)).toFixed(2)}
            </p>

            <button
              onClick={handleConfirmOrder}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition mt-6"
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
