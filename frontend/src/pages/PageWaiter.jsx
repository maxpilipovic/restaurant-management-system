import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TableCard from '../components/common/TableCard';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../common/loadingPage.jsx';
import ErrorPage from '../common/errorPage.jsx';
import Tabs from '../components/layout/Tabs.jsx';


export const PageWaiter = () => {
    const { user, signOut } = useAuth();
    const [hostName, setHostName] = useState("");
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const[authorized, setAuthorized] = useState(null);
    
    useEffect(() => {
        const checkAccess = async () => {
            if (!user) {
                //console.log(user);
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
                    setHostName(currentUser.first_name + " " + currentUser.last_name);
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                Welcome, {hostName}
                </h1>
            </div>
            
            <h1 className="text-2xl font-bold mb-6">Waiter Dashboard</h1>

            <Tabs
            children={[
                {
                label: "Tables",
                content: (
                    <div className="grid max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
                    {tables.map((table) => (
                        <Link key={table.table_id} to={`/create-order/${table.table_id}`}>
                        <TableCard
                            tableNumber={table.table_number}
                            status={table.status}
                        />
                        </Link>
                    ))}
                    </div>
                ),
                },
            ]}
            />
        </div>
    );
}
export default PageWaiter;