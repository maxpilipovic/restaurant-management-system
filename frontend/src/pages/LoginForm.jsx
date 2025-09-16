import React from 'react';
import { useState } from 'react';

const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-600">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <p className="text-xl font-semibold text-gray-800 mb-6 text-center">Restaurant Management System</p>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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

                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition transform active:scale-95" type="submit">
                        Login
                    </button>
                </form>

            </div>
        </div>
    );
};

export default LoginForm;