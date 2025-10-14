import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    const [selectedItem, setSelectedItem] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [table, setTable] = useState("");
    const [notes, setNotes] = useState("");

useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const tablesResponse = await fetch('http://localhost:3001/api/tables');
                const tablesData = await tablesResponse.json();
                 setTables(tablesData);

                 const menuItemsResponse = await fetch('http://localhost:3001/api/menu_items');
                 const menuItemsData = await menuItemsResponse.json();
                setMenuItems(menuItemsData);

              // console.log('API Data for Menu Items:', menuItemsData);

            } catch (err) {
                setError('Failed to load data. Please refresh the page.');
                console.error(err);
                
            
            } finally {
                
                setLoading(false);
            }
        };

        fetchTables();
    }, []);
  

        const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedItem|| !quantity|| !table){
            alert("Please fill in all fields");
            return;
        }
         

        const menuItem = menuItems.find(item => item.name === selectedItem);
        if (!menuItem) return; 

        const newOrderItemData = {
            item_id: menuItem.item_id,
            table_id: Number(table),
            quantity: Number(quantity),
            special_requests: notes
        };

         try {
            const ordersResponse = await fetch("http://localhost:3001/api/orders", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrderItemData),
            });
            

       const itemForDisplay = Object.assign({}, newOrderItemData);
   
    itemForDisplay.name = selectedItem;
    itemForDisplay.id = Date.now(); 
    itemForDisplay.table = table;
    itemForDisplay.notes = notes;

  
    setOrderItems(prevItems => prevItems.concat(itemForDisplay));

    
    setSelectedItem("");
    setQuantity(1);
    setTable("");
    setNotes("");

} catch (err) {

    alert("Failed to save the order item. Please try again.");
    console.error(err);
}
        }
         return (
            <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">Create New Order</h1>
        <form onSubmit={handleSubmit} className="ml-10 mt-5 flex gap-5 items-center">
            <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            >
             <option value="" disabled>Select an item...</option> {}
            {menuItems.map(item => (
            <option key={item.item_id} value={item.name}>
            {item.name}
             </option>
            ))}
            </select>


            <select 
            value={table}
            onChange={(e) => setTable(e.target.value)}
            >
            <option value="" disabled>Select a table...</option>
            {tables.map(t => (
            <option key={t.table_id} value={t.table_id}>
            Table {t.table_id}
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