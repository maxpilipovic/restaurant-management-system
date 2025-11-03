import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateOrder from './CreateOrder'; 
import TableCard from '../components/common/TableCard';
import { useAuth } from '../contexts/AuthContext';
import AdminUsers from '../AdminComponents/AdminUsers.jsx';
import LoadingPage from '../common/loadingPage.jsx';
import ErrorPage from '../common/errorPage.jsx';


export const PageWaiter = () => {
    const { user, signOut } = useAuth();
    
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const[authorized, setAuthorized] = useState(null);
    
    useEffect(() => {
        const checkAccess = async () => {
            if (!user) {
                console.log(user);
                setAuthorized(false);
                setLoading(false);
                return;
            }

            try {
                const usersResponse = await fetch('http://localhost:3001/api/users');
                const usersData = await usersResponse.json();

                //console.log("Looking for this email:", user.email);
                const currentUser = usersData.find(u => u.email === user.email);
                //console.log("Found this user in database:", currentUser);
            
                if (currentUser && (currentUser.role_id === 2 || currentUser.role_id === 6)) { 
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                }
            } catch (error) {
                console.error("Error during authorization check:", error);
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [user]); 


    //API Calls
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const tablesResponse = await fetch('http://localhost:3001/api/tables');
                const tablesData = await tablesResponse.json();
                setTables(tablesData);
            }
                
            catch (err) {
                setError('Failed to load data. Please refresh the page.');
                console.error(err);
                    
                
            } finally {
                setLoading(false);
                }
            };

        fetchTables();
    }, []);
    
    if (loading) {
        return <LoadingPage />;
    }

    if (!authorized) {
        return <ErrorPage message="You are not authorized to view this page." />;
    }
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Waiter Dashboard</h1>
            </div>

            {}
            <div className="grid max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
                {tables.map(tables => (
                  <Link key={tables.table_id} to={`/create-order/${tables.table_id}`}>
                    <TableCard 
                    tableNumber={tables.table_number} 
                    status={tables.status} 
                     />
                </Link>
                ))}
            </div>
        </div>
    );
}
export default PageWaiter;