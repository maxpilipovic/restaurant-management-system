import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateOrder = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { tableId } = useParams();
  const [editingId, setEditingId] = useState(null);

  const [selectedFood, setSelectedFood] = useState("");
  const [selectedDrink, setSelectedDrink] = useState("");
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [drinkQuantity, setDrinkQuantity] = useState(1);
  const [foodNotes, setFoodNotes] = useState("");
  const [drinkNotes, setDrinkNotes] = useState("");
  const [table, setTable] = useState(tableId || "");
  const [selectedFlavor, setSelectedFlavor] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const tablesResponse = await fetch("http://localhost:3001/api/tables");
        const tablesData = await tablesResponse.json();
        console.log("Tables data from API:", tablesData);
        setTables(tablesData);

        const menuItemsResponse = await fetch(
          "http://localhost:3001/api/menu_items"
        );
        const menuItemsData = await menuItemsResponse.json();
        setMenuItems(menuItemsData);

        // console.log('API Data for Menu Items:', menuItemsData);
      } catch (err) {
        setError("Failed to load data. Please refresh the page.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleEdit = (id) => {
    const item = orderItems.find((i) => i.id === id);
    if (!item) return;

    if (item.category === "Drink") {
      setSelectedDrink(item.name);
      setDrinkQuantity(item.quantity);
      setDrinkNotes(item.notes || "");
    } else {
      setSelectedFood(item.name);
      setFoodQuantity(item.quantity);
      setFoodNotes(item.notes || "");
    }

    setEditingId(id);
  };


  const handleRemove = (id) => {
    setOrderItems((prev) => prev.filter((i) => i.id !== id));
  };
   const handleSubmitDrink = async (e) => {
     e.preventDefault();
     if (!selectedDrink || !table) {
       alert("Please select a drink item");
       return;
     }

     const drinkItem = menuItems.find((item) => item.name === selectedDrink);
     if (!drinkItem) return;

     const newOrderItem = {
       id: editingId || Date.now(),
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
       await fetch("http://localhost:3001/api/orders", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           item_id: drinkItem.item_id,
           table_id: Number(table),
           quantity: Number(drinkQuantity),
           special_requests: drinkNotes,
           flavor: selectedFlavor || null,
         }),
       });

       if (editingId) {
         setOrderItems((prev) =>
           prev.map((i) => (i.id === editingId ? newOrderItem : i))
         );
         setEditingId(null);
       } else {
         setOrderItems((prev) => [...prev, newOrderItem]);
       }

       setSelectedDrink("");
       setDrinkQuantity(1);
       setDrinkNotes("");
       setSelectedFlavor("");
     } catch (err) {
       console.error("Error adding drink:", err);
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
       id: editingId || Date.now(),
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
       await fetch("http://localhost:3001/api/orders", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           item_id: foodItem.item_id,
           table_id: Number(table),
           quantity: Number(foodQuantity),
           special_requests: foodNotes,
         }),
       });

       if (editingId) {
         setOrderItems((prev) =>
           prev.map((i) => (i.id === editingId ? newOrderItem : i))
         );
         setEditingId(null);
       } else {
         setOrderItems((prev) => [...prev, newOrderItem]);
       }

       setSelectedFood("");
       setFoodQuantity(1);
       setFoodNotes("");
     } catch (err) {
       console.error("Error adding food:", err);
       alert("Failed to save food item");
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

            <optgroup label="Soda Flavors">
              {menuItems
                .filter(
                  (item) =>
                    item.category === "Drink" && item.name.includes("Soda")
                )
                .map((item) => (
                  <option key={item.item_id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </optgroup>
          </select>
          {selectedDrink.toLowerCase().includes("soda") && (
            <select
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="" disabled>
                Select flavor...
              </option>
              <option value="Mana Mist">Mana Mist</option>
              <option value="Health Tonic">Health Tonic</option>
              <option value="Mountain Doom">Mountain Doom</option>
              <option value="Red Ring Rush">Red Ring Rush</option>
              <option value="Nuka Fizz">Nuka Fizz</option>
              <option value="Hyper Potion Pop">Hyper Potion Pop</option>
              <option value="Starman Sparkle">Starman Sparkle</option>
              <option value="Turbo Cola">Turbo Cola</option>
              <option value="8-Bit Berry Blast">8-Bit Berry Blast</option>
              <option value="Respawn Root Beer">Respawn Root Beer</option>
              <option value="Koopa Kola">Koopa Kola</option>
              <option value="Final Fizzasy">Final Fizzasy</option>
              <option value="Warp Pipe Watermelon">Warp Pipe Watermelon</option>
              <option value="XP Elixir">XP Elixir</option>
              <option value="Lag-Free Lemon-Lime">Lag-Free Lemon-Lime</option>
              <option value="Dragonborn Drank">Dragonborn Drank</option>
              <option value="Checkpoint Cherry">Checkpoint Cherry</option>
              <option value="Glitch Grape">Glitch Grape</option>
              <option value="Pixel Punch">Pixel Punch</option>
              <option value="Overclock Orange">Overclock Orange</option>
            </select>
          )}
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
            {editingId ? "Save Changes" : "Add Drink"}
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
            {editingId ? "Save Changes" : "Add Food"}
          </button>
        </div>
      </form>
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-4">Current Order</h2>
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
                        {item.quantity} x {item.name} ({item.category}) - Table{" "}
                        {item.table}
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
