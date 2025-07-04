import Link from "next/link";
import { sanitizeTitle } from "../lib/utils";

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link href={`/articles/${article.id}`}>
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 hover:text-blue-600">
          {sanitizeTitle(article.title)}
        </h2>
      </Link>
      <p className="text-gray-500 text-sm mb-2">
        Published{" "}
        {new Date(article.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        | 5 min read
      </p>
      <div
        className="text-gray-600 mb-4 prose"
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
              href={`/tags/${tag}`}
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
                href={`/glossary/${item.term}`}
                className="text-blue-500 hover:underline font-medium"
              >
                {item.term}
              </Link>
              : {item.definition}
            </div>
          ))
        ) : (
          <p className="ml-4 text-gray-600">No glossary terms available.</p>
        )}
      </div>
      <div className="flex gap-4">
        <h3 className="text-lg font-medium text-gray-700">Citation:</h3>
        <p className="text-gray-600">{article.citation}</p>
        <a
          href={article.url}
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Article
        </a>
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
  );
}