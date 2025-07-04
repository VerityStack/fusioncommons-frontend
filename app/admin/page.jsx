"use client";
import { useState } from "react";
import axios from "axios";
import qs from "qs";
import Link from "next/link";
import ErrorBoundary from "../../components/ErrorBoundary";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [prompts, setPrompts] = useState({});
  const [useCustomPrompts, setUseCustomPrompts] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://veritystack.onrender.com/token",
        qs.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      setToken(response.data.access_token);
      setError("");
      fetchPrompts(response.data.access_token);
    } catch (err) {
      setError("Login failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const fetchPrompts = async (token) => {
    try {
      const response = await axios.get(
        "https://veritystack.onrender.com/api/prompts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPrompts(response.data.prompts);
      setUseCustomPrompts(response.data.useCustomPrompts);
    } catch (err) {
      setError("Failed to fetch prompts: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggle = async () => {
    try {
      await axios.post(
        "https://veritystack.onrender.com/api/toggle",
        { useCustomPrompts: !useCustomPrompts },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUseCustomPrompts(!useCustomPrompts);
    } catch (err) {
      setError("Failed to toggle prompts: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleSavePrompts = async () => {
    try {
      await axios.post(
        "https://veritystack.onrender.com/api/prompts",
        { prompts },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setError("");
    } catch (err) {
      setError("Failed to save prompts: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 pt-20">
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg fixed w-full top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">
              FusionCommons.ai
            </Link>
            <div className="space-x-6">
              <Link href="/" className="px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Home
              </Link>
              <Link href="/admin" className="px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto p-6 max-w-6xl">
          <h1 className="text-3xl font-bold mb-4">Admin Portal</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {!token ? (
            <form onSubmit={handleLogin} className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Login
              </button>
            </form>
          ) : (
            <div>
              <h2 className="text-2xl mb-4">Manage Prompts</h2>
              <textarea
                value={JSON.stringify(prompts, null, 2)}
                onChange={(e) => {
                  try {
                    setPrompts(JSON.parse(e.target.value));
                  } catch (err) {
                    setError("Invalid JSON format");
                  }
                }}
                className="w-full h-64 p-2 border rounded"
              />
              <button
                onClick={handleSavePrompts}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
              >
                Save Prompts
              </button>
              <div className="mt-4">
                <label className="block text-gray-700">Use Custom Prompts</label>
                <input
                  type="checkbox"
                  checked={useCustomPrompts}
                  onChange={handleToggle}
                  className="mr-2"
                />
                {useCustomPrompts ? "Enabled" : "Disabled"}
              </div>
            </div>
          )}
        </div>
        <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="container mx-auto text-center">
            <p className="text-lg">© 2025 FusionCommons.ai. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}