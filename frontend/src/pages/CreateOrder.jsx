import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateOrder = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { tableId } = useParams();
 const [editingDrinkId, setEditingDrinkId] = useState(null);
 const [editingFoodId, setEditingFoodId] = useState(null);

  const [selectedFood, setSelectedFood] = useState("");
  const [selectedDrink, setSelectedDrink] = useState("");
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [drinkQuantity, setDrinkQuantity] = useState(1);
  const [foodNotes, setFoodNotes] = useState("");
  const [drinkNotes, setDrinkNotes] = useState("");
  const [table, setTable] = useState(tableId || "");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);

  

  const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const [menuRes, tablesRes] = await Promise.all([
        fetch("http://localhost:3001/api/menu_items"),
        fetch("http://localhost:3001/api/tables"),
      ]);

      const menuData = await menuRes.json();
      const tableData = await tablesRes.json();

      setMenuItems(menuData);
      setTables(tableData);
    } catch (err) {
      console.error("Failed to load menu or tables:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

useEffect(() => {
  const initializeOrder = async () => {
    try {
      // Fetch all existing orders
      const checkRes = await fetch("http://localhost:3001/api/orders");
      const allOrders = await checkRes.json();

      // See if there's already an open order for this table
      const openOrder = allOrders.find(
        (o) => o.table_id === Number(tableId) && o.order_status === "Open"
      );

      if (openOrder) {
        // Reuse existing order instead of creating a new one
        setCurrentOrderId(openOrder.order_id);
        console.log("Reusing existing open order:", openOrder);

        // Load existing order items for that order
        const itemsRes = await fetch(
          `http://localhost:3001/api/order_items/${openOrder.order_id}`
        );
        const itemsData = await itemsRes.json();
        setOrderItems(itemsData);
      } else {
        // Create a new one if no open order exists
        const response = await fetch(
          "http://localhost:3001/api/orders/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              table_id: Number(tableId),
              waiter_id: 1, // later replace with logged-in waiter
            }),
          }
        );

        const data = await response.json();
      setCurrentOrderId(data.order_id);
        console.log("Created new order:", data[0]);
      }
    } catch (error) {
      console.error("Error initializing order:", error);
    }
  };

  initializeOrder();
}, [tableId]);


  const handleEdit = (id) => {
    const item = orderItems.find((i) => i.id === id);
    if (!item) return;

    if (item.category === "Drink" || item.category === "drink") {
      setSelectedDrink(item.name);
      setDrinkQuantity(item.quantity);
      setDrinkNotes(item.notes || "");
      setEditingDrinkId(id);
      setEditingFoodId(null); // ensure only drink edit mode is active
    } else {
      setSelectedFood(item.name);
      setFoodQuantity(item.quantity);
      setFoodNotes(item.notes || "");
      setEditingFoodId(id);
      setEditingDrinkId(null); // ensure only food edit mode is active
    }
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/order_items/${id}`, {
        method: "DELETE",
      });
      setOrderItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleSubmitDrink = async (e) => {
    
    console.log("currentOrderId when submitting:", currentOrderId);
    e.preventDefault();
    if (!selectedDrink || !table) {
      alert("Please select a drink item");
      return;
    }

    const drinkItem = menuItems.find((item) => item.name === selectedDrink);
    if (!drinkItem) return;

    const newOrderItem = {
      id: editingDrinkId || Date.now(),
      name: drinkItem.name,
      category: drinkItem.category,
      table,
      quantity: drinkQuantity,
      notes: drinkNotes,
    };

    if (selectedDrink.toLowerCase().includes("soda") && selectedFlavor) {
      newOrderItem.flavor = selectedFlavor;
    }

    try {
      if (editingDrinkId) {
        // EDIT EXISTING DRINK
        await fetch(`http://localhost:3001/api/order_items/${editingDrinkId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            item_id: drinkItem.item_id,
            quantity: Number(drinkQuantity),
            special_requests: drinkNotes,
          }),
        });

        // Update local React state instantly
        setOrderItems((prev) =>
          prev.map((i) =>
            i.id === editingDrinkId
              ? {
                  ...i,
                  item_id : drinkItem.item_id,
                  quantity: Number(drinkQuantity),
                  notes: drinkNotes,
                  flavor: selectedFlavor || i.flavor,
                }
              : i
          )
        );

        setEditingDrinkId(null);
     } else {
  const response = await fetch("http://localhost:3001/api/order_items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: currentOrderId,
      item_id: drinkItem.item_id,
      quantity: Number(drinkQuantity),
      special_requests: drinkNotes,
    }),
  });


  if (response.ok) {
    setOrderItems((prev) => [...prev, newOrderItem]);

  } 
  else {
    console.error("Failed to add drink:", await response.text());
  }
      }

      
      setSelectedDrink("");
      setDrinkQuantity(1);
      setDrinkNotes("");
      setSelectedFlavor("");
    } catch (err) {
      console.error("Error saving drink:", err);
      alert("Failed to save drink item");
    }
  };

const handleSubmitFood = async (e) => {
  e.preventDefault();
  if (!selectedFood || !table) {
    alert("Please select a food item");
    return;
  }

  const foodItem = menuItems.find((item) => item.name === selectedFood);
  if (!foodItem) return;

  const newOrderItem = {
    id: editingFoodId || Date.now(),
    name: foodItem.name,
    category: foodItem.category,
    table,
    quantity: foodQuantity,
    notes: foodNotes,
  };

  const selectedItem = menuItems.find((i) => i.name === selectedFood);
  if (
    selectedItem &&
    (selectedItem.name.toLowerCase().includes("burger") ||
      selectedItem.name.toLowerCase().includes("steak"))
  ) {
    newOrderItem.cookLevel = selectedItem.cookLevel || "";
  }

  try {
    if (editingFoodId) {
      // edit existing food item
      await fetch(`http://localhost:3001/api/order_items/${editingFoodId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: foodItem.item_id,
          quantity: Number(foodQuantity),
          special_requests: foodNotes,
        }),
      });

      //  update UI and reset edit mode
      await fetchUpdatedOrderItems();
      setEditingFoodId(null);
      setSelectedFood("");
      setFoodQuantity(1);
      setFoodNotes("");
      return; // exit early after editing
    }

    // add new food item
    const response = await fetch("http://localhost:3001/api/order_items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: currentOrderId,
        item_id: foodItem.item_id,
        quantity: Number(foodQuantity),
        special_requests: foodNotes,
      }),
    });

    if (response.ok) {
      await fetchUpdatedOrderItems();
     
      setSelectedFood("");
      setFoodQuantity(1);
      setFoodNotes("");
      setEditingFoodId(null);
    } else {
      console.error("Failed to add food:", await response.text());
    }
  } catch (err) {
    console.error("Error saving food:", err);
    alert("Failed to save food item");
  }
};



const fetchUpdatedOrderItems = async () => {
  try {
    const res = await fetch(
      `http://localhost:3001/api/order_items/${currentOrderId}`
    );
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    setOrderItems(data);
  } catch (err) {
    console.error("Error reloading order items:", err);
  }
};


  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Create New Order</h1>
      <form onSubmit={handleSubmitDrink} className="ml-10 mt-5 space-y-4">
        {/* row for drink order */}
        <div className="flex gap-5 items-center">
          <select
            value={selectedDrink}
            onChange={(e) => setSelectedDrink(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="" disabled>
              Select a drink...
            </option>

            <optgroup label="Special Drinks">
              {menuItems
                .filter(
                  (item) =>
                    item.category === "Drink" && !item.name.includes("Soda")
                )
                .map((item) => (
                  <option key={item.item_id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Soda">
              {menuItems
                .filter(
                  (item) =>
                    item.category === "drink"
                )
                .map((item) => (
                  <option key={item.item_id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </optgroup>
          </select>
          <input
            type="number"
            min="1"
            value={drinkQuantity}
            onChange={(e) => setDrinkQuantity(e.target.value)}
            className="border p-1 rounded w-20"
          />

          <input
            type="text"
            value={`Table ${table}`}
            readOnly
            className="border p-1 rounded bg-gray-100 w-32 text-center"
          />

          <input
            type="text"
            value={drinkNotes}
            placeholder="Special Requests"
            className="border p-1 rounded flex-grow"
            onChange={(e) => setDrinkNotes(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingDrinkId ? "Save Changes" : "Add Drink"}
          </button>
        </div>
      </form>

      <form onSubmit={handleSubmitFood} className="ml-10 mt-5 space-y-4">
        {/* row for food order */}
        <div className="flex gap-5 items-center">
          <select
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="" disabled>
              Select a food item...
            </option>

            <optgroup label="Appetizers">
              {menuItems
                .filter((item) => item.category === "Appetizer")
                .map((item) => (
                  <option key={item.item_id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Burgers & Sandwiches">
              {menuItems
                .filter(
                  (item) =>
                    item.category === "Burger" || item.category === "Sandwich"
                )
                .map((item) => (
                  <option key={item.item_id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Entrées">
              {menuItems
                .filter((item) => item.category === "Entree")
                .map((item) => (
                  <option key={item.item_id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Sides">
              {menuItems
                .filter((item) => item.category === "Side")
                .map((item) => (
                  <option key={item.item_id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Desserts">
              {menuItems
                .filter((item) => item.category === "Dessert")
                .map((item) => (
                  <option key={item.item_id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </optgroup>
          </select>
          {(() => {
            const selectedItem = menuItems.find(
              (item) => item.name === selectedFood
            );
            if (
              selectedItem &&
              (selectedItem.name.toLowerCase().includes("burger") ||
                selectedItem.name.toLowerCase().includes("steak"))
            ) {
              const isSteak = selectedItem.name.toLowerCase().includes("steak");
              return (
                <select
                  value={selectedItem.cookLevel || ""}
                  onChange={(e) =>
                    setMenuItems((prev) =>
                      prev.map((i) =>
                        i.name === selectedFood
                          ? { ...i, cookLevel: e.target.value }
                          : i
                      )
                    )
                  }
                  className="border p-1 rounded"
                >
                  <option value="" disabled>
                    Select cook level...
                  </option>

                  {isSteak && <option value="Blue">Blue</option>}
                  <option value="Rare">Rare</option>
                  <option value="Medium Rare">Medium Rare</option>
                  <option value="Medium">Medium</option>
                  <option value="Medium Well">Medium Well</option>
                  <option value="Well Done">Well Done</option>
                </select>
              );
            }
            return null;
          })()}

          <input
            type="number"
            min="1"
            value={foodQuantity}
            onChange={(e) => setFoodQuantity(e.target.value)}
            className="border p-1 rounded w-20"
          />

          <input
            type="text"
            value={`Table ${table}`}
            readOnly
            className="border p-1 rounded bg-gray-100 w-32 text-center"
          />

          <input
            type="text"
            value={foodNotes}
            placeholder="Special Requests"
            className="border p-1 rounded flex-grow"
            onChange={(e) => setFoodNotes(e.target.value)}
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingFoodId ? "Save Changes" : "Add Food"}
          </button>
        </div>
      </form>
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-4">Current Order - Table {table}</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {orderItems.length === 0 ? (
            <p className="text-gray-500">No items have been added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orderItems.map((item) => (
                <li key={item.id} className="py-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">
                        {item.quantity} x {item.name} ({item.category}) 
                        
                      </p>
                      {item.name.toLowerCase().includes("soda") &&
                        item.flavor && (
                          <p className="text-sm text-gray-700">
                            Flavor: {item.flavor}
                          </p>
                        )}

                      {(item.name.toLowerCase().includes("burger") ||
                        item.name.toLowerCase().includes("steak")) &&
                        item.cookLevel && (
                          <p className="text-sm text-gray-700">
                            Cook Level: {item.cookLevel}
                          </p>
                        )}

                      {item.notes && (
                        <p className="text-sm italic text-gray-600">
                          Notes: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
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

