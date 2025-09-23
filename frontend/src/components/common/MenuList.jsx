import React from "react";

const MenuList = ({ menuItems, addMenuItem, removeMenuItem, changePrice, toggleSpecial }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center mb-2">
            <span>
              {item.name} — ${item.price.toFixed(2)}{" "}
              {item.is_special && (
                <span className="text-green-600">(Special)</span>
              )}
            </span>
            <div className="flex gap-2">
              <button
                className="text-blue-600 underline"
                onClick={() => changePrice(item.id, item.price + 1)}
              >
                +$1
              </button>
              <button
                className="text-yellow-600 underline"
                onClick={() => toggleSpecial(item.id)}
              >
                Toggle Special
              </button>
              <button
                className="text-red-600 underline"
                onClick={() => removeMenuItem(item.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => addMenuItem("New Dish", 9.99)}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Add Menu Item
      </button>
    </section>
  );
};

export default MenuList;