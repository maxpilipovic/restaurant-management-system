import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    //Toast notifications

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValidLogin = true; //Replace with actual logic once db comes!!!

        if (isValidLogin) {
            toast.success("Login successful!", {
                position: "top-right",
                autoClose: 3000,
            });

        } else {
            toast.error("Login failed. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black to-gray-600">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <p className="text-xl font-semibold text-gray-800 mb-6 text-center">Restaurant Management System</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="INB Email"
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

                    <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition transform active:scale-95" type="submit">
                        Admin Login
                    </button>
                </form>

            </div>
        </div>
    );
};

export default LoginForm;