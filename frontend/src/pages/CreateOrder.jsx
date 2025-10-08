import React from 'react';
import { useState } from 'react';

const CreateOrder = ({ onaddItem }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [table, setTable] = useState("");
    const[notes, setNotes] = useState("");
    

const tables = [
        { id: 1, number: 1 },
        { id: 2, number: 2},
        { id: 3, number: 3},
        { id: 4, number: 4},
        { id: 5, number: 5},
        { id: 6, number: 6},
        { id: 7, number: 7},
        { id: 8, number: 8},
        { id: 9, number: 9},
        { id: 10, number: 10},
    ];
    const mockMenuItems = [
    { id: 1, name: 'Spaghetti Carbonara', price: 18.50, category: 'Mains' },
    { id: 2, name: 'Grilled Salmon', price: 24.00, category: 'Mains' },
    { id: 3, name: 'Caesar Salad', price: 12.00, category: 'Appetizers' },
    { id: 4, name: 'Diet Coke', price: 3.50, category: 'Drinks' },
    { id: 5, name: 'Cheesecake', price: 9.00, category: 'Desserts' }
];
const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedItem|| !quantity|| !table)
        {
            return;
        }

    
const newItem = {
            id: Date.now(), 
            name: selectedItem,
            quantity: Number(quantity), 
            table: table,
            notes: notes,
        };

        
        setOrderItems(prevItems => [...prevItems, newItem]);

       
        setSelectedItem("");
        setQuantity(1);
        setTable("");
        setNotes("");

};
         return (
            <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">Create New Order</h1>
        <form onSubmit={handleSubmit} className="ml-10 mt-5 flex gap-5 items-center">
            <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            >
             <option value="" disabled>Select an item...</option> {}
            {mockMenuItems.map(item => (
            <option key={item.id} value={item.name}>
            {item.name}
             </option>
            ))}
            </select>


            <select 
            value={table}
            onChange={(e) => setTable(e.target.value)}
            >
            <option value="" disabled>Select a table...</option>
            {tables.map(table => (
            <option key={table.id} value={table.number}>
            Table {table.number}
            </option>
            ))}
            
        </select>


            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <input 
            type="text" 
            value={notes}
            placeholder="Special Requests"
            className="border p-1 rounded flex"
            onChange={(e) => setNotes(e.target.value)}
            />
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Add Item
            </button>
        </form>


        <div className="mt-10">
                <h2 className="text-3xl font-bold mb-4">Current Order</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    {orderItems.length === 0 ? (
                        <p className="text-gray-500">No items have been added yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {orderItems.map(item => (
                                <li key={item.id} className="py-3">
                                    <p className="font-bold text-lg">{item.quantity}x {item.name} - (Table {item.table})</p>
                                    {item.notes && <p className="text-sm italic text-gray-600">Notes: {item.notes}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );

};

export default CreateOrder;