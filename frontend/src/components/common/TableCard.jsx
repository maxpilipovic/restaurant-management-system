import React from 'react';


//Reusable Table Card
const TableCard = ({ tableNumber, status }) => {
    
    const getStatusStyles = () => {
        switch (status) {
            case 'Empty':
                return 'bg-green-500 text-white'; 
            case 'In progress':
                return 'bg-yellow-400 text-black'; 
            case 'Done':
                return 'bg-cyan-500 text-white'; 
            default:
                return 'bg-gray-400 text-white'; 
        }
    };

    return (
        <div className={`w-40 rounded-lg shadow-md text-center p-3 ${getStatusStyles()}`}>
            <div className="font-bold text-sm">Table</div>
            <div className="text-4xl font-extrabold">
                {tableNumber}
            </div>
            <div className="text-sm">
                {status}
            </div>
        </div>
    );
};

export default TableCard;