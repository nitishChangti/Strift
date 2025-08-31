import { useState } from 'react';

export default function LoginForm({ onContinue }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            // TODO: save to Redux if needed
            onContinue();
        }
    };

    return (
        <div className="border rounded p-4 bg-amber-100">
            <h2 className="text-lg font-bold mb-2">LOGIN OR SIGNUP</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Email/Mobile number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-2 w-full mb-2"
                />
                <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                    CONTINUE
                </button>
            </form>
        </div>
    );
}
