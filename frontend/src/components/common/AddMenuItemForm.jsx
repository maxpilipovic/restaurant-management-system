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
    <section className="p-6 bg-white rounded-xl shadow-sm border mt-8 hover:shadow-md transition-all duration-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Add New Menu Item
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Cheeseburger"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 9.99"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all"
          >
            Add Item
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddMenuItemForm;