// app/glossary/[term]/page.jsx
import GlossaryContent from './GlossaryContent';
import { sanitizeTitle } from '../../../lib/utils';

export default async function GlossaryPage({ params }) {
  const resolvedParams = await params;  // Await here
  const { term } = params || {};
  if (!term) {
    return <p className="text-red-500 p-4">Glossary term not provided.</p>;
  }

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
      (article.glossary || []).some(
        (item) => item.term?.toLowerCase() === decodedTerm.toLowerCase()
      )
    );
    if (articles.length === 0) error = "No articles found for this term.";
  } catch (err) {
    console.error("Fetch error:", err);
    error = "Failed to load articles.";
  }

  return (
    <GlossaryContent
      term={decodeURIComponent(term)}
      articles={articles || []}
      error={error}
    />
  );
}
