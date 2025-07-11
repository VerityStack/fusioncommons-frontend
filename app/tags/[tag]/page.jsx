// app/tags/[tag]/page.jsx
import TagContent from './TagContent'; // Ensure correct casing
import { sanitizeTitle } from '../../../lib/utils';

export default async function TagPage({ params }) {
  const { tag } = params;
  let articles = [];
  let error = '';

  try {
    const res = await fetch(`${process.env.API_URL}/api/articles`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    const decodedTag = decodeURIComponent(tag);
    articles = data.filter((article) =>
      (article.tags || []).includes(decodedTag)
    );
    if (articles.length === 0) error = 'No articles found for this tag.';
  } catch (err) {
    console.error('Fetch error:', err);
    error = 'Failed to load articles.';
  }

  return <TagContent tag={decodeURIComponent(tag)} articles={articles} error={error} />;
}