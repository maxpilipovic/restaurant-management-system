import React from 'react';
import { useState } from 'react';
import WorkerList from './WorkerList';

const AddWorkerForm = ({ addWorker }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("Waiter");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!firstName || !lastName)
        {
            return;
        }

        addWorker(firstName, lastName, role);

        //reset again virg
        setFirstName("");
        setLastName("");
        setRole("Waiter");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <input
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="Waiter">Waiter</option>
                <option value="Host">Host</option>
                <option value="Manager">Manager</option>
            </select>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Add Worker
            </button>
        </form>
    );


};

export default AddWorkerForm;