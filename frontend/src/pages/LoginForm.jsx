import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const backendUrl = import.meta.env.VITE_BACKEND_URL;
    //Toast notifications

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Login logic lowkey
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error('Supabase auth error!!!', error);
                toast.error('Login failed. Please check your credentials.');
                return;
            }

            //Grab user and check if exists
            const user = data.user;
            console.log(`user: ${JSON.stringify(user.email)}`);
            if (!user) {
                toast.error('No user found');
                return;
            }
            let role;
            try {
                const { data, error } = await supabase
                  .from("users")
                  .select("role_id")
                  .eq("email", user.email) 
                  .single();
                if (error) {
                    console.error(error);
                    toast.error('Failed to fetch role');
                    return;
                }
                role = data.role_id;
                console.log(`role: ${typeof role}`);

              } catch (err) {
                console.error(err);
              }

            //Switch
            switch (role) {
                case 1:
                    console.log('Navigating to chef page');
                    navigate('/host');
                    break;
                case 2:
                    console.log('Navigating to waiter page');   
                    navigate('/waiter');
                    break;
                case 3:
                    console.log('Navigating to manager page');
                    navigate('/chef');
                    break;
                case 4:
                    console.log('Navigating to host page');
                    navigate('/manager');
                    break;
                case 5:
                    console.log('Navigating to owner page');
                    navigate('/owner');
                    break;
                case 6:
                    console.log('Navigating to admin page');
                    navigate('/admin');
                    break;
                default:
                    console.log('Navigating to home page');
                    navigate('/');
                    break;
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black to-gray-600">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <p className="text-xl font-semibold text-gray-800 mb-6 text-center">Restaurant Management System</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition transform active:scale-95" type="submit">
                        Login
                    </button>

                    <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition transform active:scale-95" type="button">
                        Admin Login
                    </button>
                </form>

                {/* Create Account Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/create-account" className="text-blue-600 hover:text-blue-800 font-semibold">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;