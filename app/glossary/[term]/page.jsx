import Link from "next/link";
import { sanitizeTitle } from "../../../lib/utils";
import ErrorBoundary from "../../../components/ErrorBoundary";

export default async function GlossaryArticles({ params }) {
  const { term } = params;
  let articles = [];
  let error = "";

  try {
    const res = await fetch(`${process.env.API_URL}/api/articles`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch articles");
    const data = await res.json();
    const decodedTerm = decodeURIComponent(term);
    articles = data.filter((article) =>
      (article.glossary || []).some((item) => item.term === decodedTerm)
    );
    if (articles.length === 0) error = "No articles found for this term.";
  } catch (err) {
    console.error("Fetch error:", err);
    error = "Failed to load articles.";
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl pt-20">
        <p className="text-red-500">{error}</p>
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
          <h1 className="text-3xl font-bold mb-6">Articles with glossary term "{decodeURIComponent(term)}"</h1>
          <div className="space-y-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">
                <Link href={`/articles/${article.id}`}>
                  <h2 className="text-2xl font-semibold mb-3 hover:text-blue-600">
                    {sanitizeTitle(article.title || "Untitled")}
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