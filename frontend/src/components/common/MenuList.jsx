import React from "react";
import AddMenuItem from "./AddMenuItemForm";

const MenuList = ({ menuItems, addMenuItem, removeMenuItem, changePrice }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center mb-2">
            <span>
              {item.name} — ${item.price}{" "}
              {item.is_special && (
                <span className="text-green-600">(Special)</span>
              )}
            </span>
            <div className="flex gap-2">
              <button
                className="text-blue-600 underline"
                onClick={() => changePrice(item.item_id, item.price + 1)}
              >
                +$1
              </button>
              <button
                className="text-blue-600 underline"
                onClick={() => changePrice(item.item_id, item.price - 1)}
              >
                -$1
              </button>
              <button
                className="text-red-600 underline"
                onClick={() => removeMenuItem(item.item_id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <AddMenuItem addMenuItem={addMenuItem} />
    </section>
  );
};

export default MenuList;