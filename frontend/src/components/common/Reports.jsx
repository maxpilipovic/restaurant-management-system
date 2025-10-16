import React from 'react';
import {useState, useEffect} from "react";

const Reports = ({ payments, orderItems, menuItems }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [itemStats, setItemStats] = useState([]);

    useEffect(() => {
        if (!startDate || !endDate) return;

        // Filter payments by date range
        const filteredPayments = payments.filter((p) => {
            const date = new Date(p.payment_time);
            return date >= new Date(startDate) && date <= new Date(endDate);
        });

        // Collect order_ids from filtered payments
        const validOrderIds = new Set(filteredPayments.map((p) => p.order_id));

        // Filter order items based on those orders
        const filteredOrderItems = orderItems.filter((oi) =>
            validOrderIds.has(oi.order_id)
        );

        // Aggregate quantities by item_id
        const itemMap = {};
        filteredOrderItems.forEach((oi) => {
            if (!itemMap[oi.item_id]) itemMap[oi.item_id] = 0;
            itemMap[oi.item_id] += oi.quantity;
        });

        // Join with menu items
        const stats = Object.entries(itemMap).map(([itemId, qty]) => {
            const menuItem = menuItems.find((m) => m.item_id === parseInt(itemId));
            return {
                name: menuItem?.name || "Unknown Item",
                category: menuItem?.category || "-",
                quantity: qty,
                revenue: (menuItem?.price || 0) * qty,
            };
        });

        // Compute total revenue from payments
        const total = filteredPayments.reduce((sum, p) => sum + Number(p.amount), 0);

        setFilteredOrders(filteredOrderItems);
        setItemStats(stats);
        setTotalRevenue(total);
    }, [startDate, endDate, payments, orderItems, menuItems]);

    return (
        <div>
            <div className="flex gap-4 mb-6">
                <div>
                    <label>
                        <h2 className="text-xl font-semibold mb-2">Start Date</h2>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <h2 className="text-xl font-semibold mb-2">End Date</h2>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            {itemStats.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-2">Item Sales</h3>
                    <table className="min-w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Item</th>
                                <th className="p-2 border">Category</th>
                                <th className="p-2 border">Quantity Sold</th>
                                <th className="p-2 border">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemStats.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 border">{item.name}</td>
                                    <td className="p-2 border">{item.category}</td>
                                    <td className="p-2 border">{item.quantity}</td>
                                    <td className="p-2 border">${item.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="text-xl font-semibold mt-6">
                        Total Revenue: ${totalRevenue.toFixed(2)}
                    </h3>
                </div>
            )}


        </div>
    );
};

export default Reports;