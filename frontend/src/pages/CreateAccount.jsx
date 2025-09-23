import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        roleId: '',
        pinCode: ''
    });

    // Fetch roles on component mount
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const { data, error } = await supabase
                .from('roles')
                .select('role_id, role_name, permission_level')
                .order('permission_level', { ascending: true });

            if (error) {
                console.error('Error fetching roles:', error);
                toast.error('Failed to load roles');
            } else {
                setRoles(data || []);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Failed to load roles');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            toast.error('Please fill in all required fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }

        if (!formData.roleId) {
            toast.error('Please select a role');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                throw authError;
            }

            if (authData.user) {
                // Insert user data into the users table
                const { error: userError } = await supabase
                    .from('users')
                    .insert([
                        {
                            email: formData.email,
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            role_id: parseInt(formData.roleId),
                            pin_code: formData.pinCode,
                            is_active: true,
                            created_at: new Date().toISOString()
                        }
                    ]);

                if (userError) {
                    throw userError;
                }

                toast.success('Account created successfully! Please check your email to verify your account.', {
                    position: "top-right",
                    autoClose: 5000,
                });

                // Reset form
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    roleId: '',
                    pinCode: ''
                });

                // Navigate to login page after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 2000);

            }
        } catch (error) {
            console.error('Error creating account:', error);
            toast.error(error.message || 'Failed to create account. Please try again.', {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-600">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-600">Restaurant Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password (min 6 characters)"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <select
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.role_name} (Level {role.permission_level})
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                        
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;