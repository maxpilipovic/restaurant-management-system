import React, { useState } from "react";

const AddMenuItemForm = ({ addMenuItem }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Please enter both name and price.");
      return;
    }

    // Call the function passed from parent to create the item
    await addMenuItem(name, parseFloat(price));

    // Reset form
    setName("");
    setPrice("");
  };

  return (
    <section className="p-6 bg-white rounded shadow mb-6">
      <h2 className="text-2xl font-semibold mb-4">Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Enter item name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Enter price"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Menu Item
        </button>
      </form>
    </section>
  );
};

export default AddMenuItemForm;