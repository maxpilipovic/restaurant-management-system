import React from 'react';
import { useState } from 'react';

const Tabs = ( { children }) => {

    const [activeTab, setActiveTab] = useState(0); //INDEX OF CURRENT TAB!

    return (
      <div className="w-full">
        {/* HEADERS */}
        <div className="flex border-b border-gray-300 mb-6">
          {children.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === index
                  ? 'border-b-2 border-blue-600 text-blue-600 -mb-px'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      {/* CONTENT */}
      <div>
        {children[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;