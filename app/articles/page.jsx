
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import axios from "axios";
import Link from "next/link";
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
        `${process.env.API_URL}/api/articles?limit=${limit}&offset=${(page - 1) * limit}`
      );
      console.log("Articles fetched:", response.data); // Debug log
      setArticles(response.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err); // Debug log
      setError("Failed to load articles: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const debouncedSearch = debounce((value) => {
    console.log("Search term:", value); // Debug log
    setSearch(value);
  }, 300);

  const filteredArticles = articles.filter((article) =>
    article.title
      ?.toLowerCase()
      .replace(/[^\w\s]/g, "")
      .includes(search.toLowerCase().replace(/[^\w\s]/g, ""))
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Articles</h1>
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
                  <div key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <Link href={`/articles/${article.id}`}>
                      <h2 className="text-2xl font-semibold mb-3 text-gray-800 hover:text-blue-600">
                        {sanitizeTitle(article.title || "Untitled")}
                      </h2>
                    </Link>
                    <p className="text-gray-500 text-sm mb-2">
                      Published{" "}
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date unavailable"}{" "}
                      | 5 min read
                    </p>
                    <p className="text-gray-600 mb-4">
                      {article.blog_content?.substring(0, 200)}...
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {(article.tags || []).map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
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