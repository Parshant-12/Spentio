import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        // This works because your input IDs match your state keys
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.status === 409) {
                if(data.field === "Email"){
                    alert("Email already registered. Please use a different email.");
                }
                else if(data.field === "Password"){
                    alert("Password already taken. Please choose a different password.");
                }
            } else if (response.ok){
                navigate('/Login');
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-800">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

                {/* Full Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-zinc-400">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="John Doe"
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-zinc-400">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="you@example.com"
                        onChange={handleChange}
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium mb-2 text-zinc-400">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="••••••••"
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors">
                    Sign Up
                </button>

                <p className="mt-4 text-sm text-center text-zinc-500">
                    Already have an account? <a href="/Login" className="text-purple-400 hover:underline">Log in</a>
                </p>
            </form>
        </div>
    );
}

export default Signup;