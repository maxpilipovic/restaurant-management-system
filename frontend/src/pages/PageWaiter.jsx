import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateOrder from './CreateOrder'; 
import TableCard from '../components/common/TableCard';


export const PageWaiter = () => {
    
    const [tables, setTables] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //API Calls
 useEffect(() => {
        const fetchTables = async () => {
            try {
                const tablesResponse = await fetch('http://localhost:3001/api/tables');
                const tablesData = await tablesResponse.json();
                 setTables(tablesData);
               

            } catch (err) {
                setError('Failed to load data. Please refresh the page.');
                console.error(err);
                
            
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);
  

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
                {tables.map(tables => (
                    <TableCard 
                        key={tables.table_id}
                        tableNumber={tables.table_number} 
                        status={tables.status} 
                    />
                ))}
            </div>
        </div>
    );
}
export default PageWaiter;