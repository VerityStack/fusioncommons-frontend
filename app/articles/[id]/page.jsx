import ArticleContent from "./ArticleContent";

export default async function ArticleDetail({ params }) {
  const resolvedParams = await params;  // Await here
  const { id } = resolvedParams;

  let article = null;
  let error = "";

  try {
    const res = await fetch(`${process.env.API_URL}/api/articles`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch articles");
    const data = await res.json();
    article = data.find((a) => a.id === id);
    if (!article) error = "Article not found.";
  } catch (err) {
    console.error("Fetch error:", err);
    error = "Failed to load article.";
  }

  return <ArticleContent article={article} error={error} />;
}