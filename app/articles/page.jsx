"use client";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import axios from "axios";
import Link from "next/link";
import ArticleCard from "../../components/ArticleCard";
import ErrorBoundary from "../../components/ErrorBoundary";
import { sanitizeTitle } from "../../lib/utils";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://veritystack.onrender.com/api/articles?limit=${limit}&offset=${(page - 1) * limit}`
      );
      setArticles(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load articles: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const debouncedSearch = debounce((value) => setSearch(value), 300);

  const filteredArticles = articles.filter((article) =>
    article.title?.toLowerCase().includes(search.toLowerCase())
  );

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
          <input
            type="text"
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder="Search articles by title..."
            className="w-full max-w-lg mx-auto mb-8 p-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
          {error && <p className="text-red-500 mb-6 text-center text-lg">{error}</p>}
          {loading ? (
            <div className="text-center">
              <svg
                className="animate-spin h-8 w-8 mx-auto text-blue-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                ></path>
              </svg>
              <p className="text-gray-600 text-lg mt-2">Loading articles...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredArticles.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">
                  No articles found. Try uploading articles in the Admin Portal.
                </p>
              ) : (
                filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              )}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={filteredArticles.length < limit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  Next
                </button>
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