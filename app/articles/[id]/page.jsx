"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { sanitizeTitle } from "../../../lib/utils";
import ErrorBoundary from "../../../components/ErrorBoundary";

export default function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/api/articles`);
        const id = window.location.pathname.split("/").pop();
        const foundArticle = response.data.find((a) => a.id === id);
        if (foundArticle) {
          setArticle(foundArticle);
          setError("");
        } else {
          setError("Article not found.");
        }
      } catch (err) {
        setError("Failed to load article: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl pt-20">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto p-6 max-w-6xl pt-20">
        <p className="text-red-500">{error || "Article not found."}</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-4">{sanitizeTitle(article.title)}</h1>
          <p className="text-gray-500 text-sm mb-4">
            Published{" "}
            {new Date(article.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            | 5 min read
          </p>
          <div
            className="text-gray-600 mb-6 prose"
            dangerouslySetInnerHTML={{
              __html: article.blog_content?.replace(/\n/g, "<br>") || "No content available.",
            }}
          />
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700">Tags:</h3>
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
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700">Glossary:</h3>
            {article.glossary && article.glossary.length > 0 ? (
              article.glossary.map((item) => (
                <div key={item.term} className="ml-4">
                  <Link
                    href={`/glossary/${encodeURIComponent(item.term)}`}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    {item.term}
                  </Link>
                  : {item.definition || "Definition not available"}
                </div>
              ))
            ) : (
              <p className="ml-4 text-gray-600">No glossary terms available.</p>
            )}
          </div>
          <div className="flex gap-4">
            <h3 className="text-lg font-medium text-gray-700">Citation:</h3>
            <p className="text-gray-600">{article.citation || "No citation available."}</p>
            {article.url && (
              <a
                href={article.url}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Article
              </a>
            )}
            {article.pdf_url && (
              <span className="ml-2">
                |{" "}
                <a
                  href={`/public/articles/${article.pdf_url.split("/").pop()}`}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PDF
                </a>
              </span>
            )}
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