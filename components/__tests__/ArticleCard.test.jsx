import { render, screen } from '@testing-library/react';
import ArticleCard from '../ArticleCard';

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    default: function MockLink({ children, href }) {
      return <a href={href}>{children}</a>;
    }
  };
});

// Mock the sanitizeTitle utility
vi.mock('../../lib/utils', () => ({
  sanitizeTitle: vi.fn((title) => title),
}));

describe('ArticleCard', () => {
  const mockArticle = {
    id: '123',
    title: 'Fusion Energy Research Breakthrough',
    published_at: '2024-01-15T10:00:00Z',
    blog_content: 'This is a sample article content about fusion energy.',
    tags: ['fusion', 'energy', 'research'],
    glossary: [
      { term: 'plasma', definition: 'A state of matter' },
      { term: 'tokamak', definition: 'A type of fusion reactor' }
    ],
    citation: 'Smith, J. et al. (2024). Fusion Research. Nature Energy.',
    url: 'https://example.com/article',
    pdf_url: 'https://example.com/pdfs/article.pdf'
  };

  it('renders article title and basic information', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Fusion Energy Research Breakthrough')).toBeInTheDocument();
    expect(screen.getByText(/Published January 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });

  it('renders article content with line breaks converted to br tags', () => {
    const articleWithLineBreaks = {
      ...mockArticle,
      blog_content: 'First line\nSecond line\nThird line'
    };
    
    render(<ArticleCard article={articleWithLineBreaks} />);
    
    const contentDiv = screen.getByText(/First line/).closest('div');
    expect(contentDiv.innerHTML).toContain('First line<br>Second line<br>Third line');
  });

  it('renders fallback when blog_content is missing', () => {
    const articleWithoutContent = {
      ...mockArticle,
      blog_content: null
    };
    
    render(<ArticleCard article={articleWithoutContent} />);
    
    expect(screen.getByText('No content available.')).toBeInTheDocument();
  });

  it('renders tags as clickable links', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Tags:')).toBeInTheDocument();
    
    const fusionTag = screen.getByRole('link', { name: 'fusion' });
    expect(fusionTag).toHaveAttribute('href', '/tags/fusion');
    
    const energyTag = screen.getByRole('link', { name: 'energy' });
    expect(energyTag).toHaveAttribute('href', '/tags/energy');
    
    const researchTag = screen.getByRole('link', { name: 'research' });
    expect(researchTag).toHaveAttribute('href', '/tags/research');
  });

  it('handles empty tags array', () => {
    const articleWithoutTags = {
      ...mockArticle,
      tags: []
    };
    
    render(<ArticleCard article={articleWithoutTags} />);
    
    expect(screen.getByText('Tags:')).toBeInTheDocument();
    // Should not render any tag links
    expect(screen.queryByRole('link', { name: 'fusion' })).not.toBeInTheDocument();
  });

  it('renders glossary terms and definitions', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Glossary:')).toBeInTheDocument();
    
    const plasmaLink = screen.getByRole('link', { name: 'plasma' });
    expect(plasmaLink).toHaveAttribute('href', '/glossary/plasma');
    expect(screen.getByText(': A state of matter')).toBeInTheDocument();
    
    const tokamakLink = screen.getByRole('link', { name: 'tokamak' });
    expect(tokamakLink).toHaveAttribute('href', '/glossary/tokamak');
    expect(screen.getByText(': A type of fusion reactor')).toBeInTheDocument();
  });

  it('handles empty glossary', () => {
    const articleWithoutGlossary = {
      ...mockArticle,
      glossary: []
    };
    
    render(<ArticleCard article={articleWithoutGlossary} />);
    
    expect(screen.getByText('Glossary:')).toBeInTheDocument();
    expect(screen.getByText('No glossary terms available.')).toBeInTheDocument();
  });

  it('handles missing glossary property', () => {
    const articleWithoutGlossary = {
      ...mockArticle,
      glossary: undefined
    };
    
    render(<ArticleCard article={articleWithoutGlossary} />);
    
    expect(screen.getByText('No glossary terms available.')).toBeInTheDocument();
  });

  it('renders citation and source links', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Citation:')).toBeInTheDocument();
    expect(screen.getByText('Smith, J. et al. (2024). Fusion Research. Nature Energy.')).toBeInTheDocument();
    
    const sourceLink = screen.getByRole('link', { name: 'Source Article' });
    expect(sourceLink).toHaveAttribute('href', 'https://example.com/article');
    expect(sourceLink).toHaveAttribute('target', '_blank');
    expect(sourceLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders PDF link when pdf_url is provided', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const pdfLink = screen.getByRole('link', { name: 'PDF' });
    expect(pdfLink).toHaveAttribute('href', '/public/articles/article.pdf');
    expect(pdfLink).toHaveAttribute('target', '_blank');
    expect(pdfLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render PDF link when pdf_url is not provided', () => {
    const articleWithoutPdf = {
      ...mockArticle,
      pdf_url: null
    };
    
    render(<ArticleCard article={articleWithoutPdf} />);
    
    expect(screen.queryByRole('link', { name: 'PDF' })).not.toBeInTheDocument();
  });

  it('has correct CSS classes for styling', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const cardContainer = screen.getByText('Fusion Energy Research Breakthrough').closest('div');
    expect(cardContainer).toHaveClass('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'hover:shadow-xl', 'transition-shadow', 'duration-300');
  });

  it('creates clickable title link to article detail page', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const titleLink = screen.getByRole('link', { name: 'Fusion Energy Research Breakthrough' });
    expect(titleLink).toHaveAttribute('href', '/articles/123');
  });
});