"use client";
import { useState, useEffect } from "react";
import { useParams, Link } from "next/navigation";
import axios from "axios";
import { sanitizeTitle } from "../../../lib/utils";
import ErrorBoundary from "../../../components/ErrorBoundary";

export default function GlossaryArticles() {
  const { term } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`https://veritystack.onrender.com/api/articles`);
        const filtered = response.data.filter((article) =>
          (article.glossary || []).some((item) => item.term === term)
        );
        setArticles(filtered);
      } catch (err) {
        setError("Failed to load articles: " + err.message);
      }
    };
    fetchArticles();
  }, [term]);

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
          <h1 className="text-3xl font-bold mb-6">Articles with glossary term "{term}"</h1>
          {error && <p className="text-red-500 mb-6">{error}</p>}
          <div className="space-y-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">
                <Link href={`/articles/${article.id}`}>
                  <h2 className="text-2xl font-semibold mb-3 hover:text-blue-600">
                    {sanitizeTitle(article.title)}
                  </h2>
                </Link>
                <p className="text-gray-600">
                  {article.blog_content?.substring(0, 200)}...
                </p>
              </div>
            ))}
          </div>
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