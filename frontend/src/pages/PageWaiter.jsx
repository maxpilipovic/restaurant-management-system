import React from 'react';
import { Link } from 'react-router-dom';
import TableCard from '../components/common/TableCard';

export const PageWaiter = () => {
    const tables = [
        { id: 1, number: 1, status: 'Empty' },
        { id: 2, number: 2, status: 'In progress' },
        { id: 3, number: 3, status: 'Done' },
        { id: 4, number: 4, status: 'Empty' },
        { id: 5, number: 5, status: 'In progress' },
        { id: 6, number: 6, status: 'Done' },
        { id: 7, number: 7, status: 'Empty' },
        { id: 8, number: 8, status: 'Empty' },
        { id: 9, number: 9, status: 'Empty' },
        { id: 10, number: 10, status: 'In progress' },
    ];

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Waiter Dashboard</h1>
                 <Link to="/Create-Order">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl">
                        Create Order
                    </button>
                </Link>
            </div>

            {}
            <div className="grid max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
                {tables.map(table => (
                    <TableCard 
                        key={table.id}
                        tableNumber={table.number} 
                        status={table.status} 
                    />
                ))}
            </div>
        </div>
    );
}
export default PageWaiter;