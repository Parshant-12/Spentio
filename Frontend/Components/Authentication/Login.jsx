import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.status === 200) {
                alert("Login successful!");
                navigate('/Dashboard');
            } else {
                alert(data.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("An error occurred during login. Please try again.");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-800">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-zinc-400">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="you@example.com"
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-zinc-400">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="••••••••"
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
                >
                    Sign In
                </button>

                <p className="mt-4 text-sm text-center text-zinc-500">
                    Don't have an account? <a href="/SignUp" className="text-purple-400 hover:underline">Sign up</a>
                </p>
            </form>
        </div>
    );
}
export default Login;