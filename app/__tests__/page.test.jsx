import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    default: function MockLink({ children, href, className }) {
      return <a href={href} className={className}>{children}</a>;
    }
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
}));

describe('Home Page', () => {
  it('renders the main navigation bar', () => {
    render(<Home />);
    
    // Check for multiple instances of FusionCommons.ai (nav and hero)
    const fusionCommonsElements = screen.getAllByText('FusionCommons.ai');
    expect(fusionCommonsElements.length).toBeGreaterThan(1);
    
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Admin Portal' })).toHaveAttribute('href', '/admin');
  });

  it('renders the hero section with correct content', () => {
    render(<Home />);
    
    // Check for hero title (appears twice - in nav and hero)
    const heroTitles = screen.getAllByText('FusionCommons.ai');
    expect(heroTitles.length).toBeGreaterThan(1);
    
    expect(screen.getByText('Discover cutting-edge fusion energy research and insights to power the future.')).toBeInTheDocument();
    
    const exploreButton = screen.getByRole('link', { name: 'Explore Articles' });
    expect(exploreButton).toHaveAttribute('href', '/articles');
  });

  it('renders the footer', () => {
    render(<Home />);
    
    expect(screen.getByText('© 2025 FusionCommons.ai. All rights reserved.')).toBeInTheDocument();
  });

  it('has correct CSS classes for layout', () => {
    render(<Home />);
    
    // Find the main container div with min-h-screen class
    const container = document.querySelector('.min-h-screen.bg-gray-50');
    expect(container).toBeInTheDocument();
  });

  it('navigation has fixed positioning', () => {
    render(<Home />);
    
    const nav = screen.getByRole('navigation') || screen.getByText('FusionCommons.ai').closest('nav');
    expect(nav).toHaveClass('fixed', 'w-full', 'top-0', 'z-10');
  });

  it('hero section has proper padding for fixed nav', () => {
    render(<Home />);
    
    const heroSection = screen.getByText('Discover cutting-edge fusion energy research and insights to power the future.').closest('section');
    expect(heroSection).toHaveClass('pt-32'); // Padding top for fixed navigation
  });

  it('all navigation links have proper styling', () => {
    render(<Home />);
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveClass('px-4', 'py-2', 'rounded-md', 'hover:bg-blue-700', 'transition-colors');
    
    const adminLink = screen.getByRole('link', { name: 'Admin Portal' });
    expect(adminLink).toHaveClass('px-4', 'py-2', 'rounded-md', 'hover:bg-blue-700', 'transition-colors');
  });

  it('explore articles button has correct styling', () => {
    render(<Home />);
    
    const exploreButton = screen.getByRole('link', { name: 'Explore Articles' });
    expect(exploreButton).toHaveClass('mt-6', 'inline-block', 'bg-white', 'text-blue-600', 'px-6', 'py-3', 'rounded-md', 'font-semibold', 'hover:bg-gray-100', 'transition-colors');
  });
});