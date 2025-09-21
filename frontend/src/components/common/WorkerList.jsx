import React from "react"
import AddWorkerForm from "./AddWorkerForm";

const WorkerList = ({ workers, addWorker, removeWorker }) => {

    return (
        <section className="mb-10">
            <h2 className="font-bold">
                Workers
            </h2>

            <ul>
                {workers.map((w) => (
                    <li key={w.id} className="flex justify-between items-center mb-2">
                        {w.first_name} {w.last_name} ({w.role})
                        <button
                        className="text-red-600 underline"
                        onClick={() => removeWorker(w.id)}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            {/* Add Worker Form */}
            <AddWorkerForm addWorker={addWorker} />
        </section>
    )
}

export default WorkerList;
