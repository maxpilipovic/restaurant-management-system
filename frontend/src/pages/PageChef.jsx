import React, { useState, useEffect } from "react";
import ChefCard from "../components/common/ChefCard";

export const PageChef = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tablesResponse = await fetch('http://localhost:3001/api/tables');
        const tablesData = await tablesResponse.json();
        

        const ordersResponse = await fetch('http://localhost:3001/api/orders');
        const ordersData = await ordersResponse.json();

        const orderItemsResponse = await fetch('http://localhost:3001/api/order_items');
        const orderItemsData = await orderItemsResponse.json();
        

        // ADD THIS: Fetch menu items
        const menuItemsResponse = await fetch('http://localhost:3001/api/menu_items');
        const menuItemsData = await menuItemsResponse.json();

        //Transform the data
        //LOOK AT THIS ANDREW...
        const transformedOrders = ordersData.map(order => {
          const table = tablesData.find(t => t.table_id === order.table_id);
          const items = orderItemsData
            .filter(item => item.order_id === order.order_id)
            .map(item => {
              // Find the menu item by item_id
              const menuItem = menuItemsData.find(mi => mi.item_id === item.item_id);
              return `${menuItem?.name || 'Item'}${item.quantity > 1 ? ` x${item.quantity}` : ''}`;
            });
        //LOOK AT THIS ANDREW...

          return {
            id: order.order_id,
            table: table?.table_number || 'N/A',
            items: items,
            status: order.order_status || 'Pending'
          };
        });

        setOrders(transformedOrders);

      } catch (error) {
        console.error('Error getting tables, orders & order_items for chef page', error);
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:3001/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus })
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="grid grid-cols-5 gap-6">
        {orders.map((order) => (
          <ChefCard
            key={order.id}
            order={order}
            onUpdateStatus={updateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default PageChef;
