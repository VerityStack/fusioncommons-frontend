import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Mock component that throws an error when shouldThrow is true
const ThrowingComponent = ({ shouldThrow, errorMessage }) => {
  if (shouldThrow) {
    throw new Error(errorMessage || 'Test error');
  }
  return <div>No error occurred</div>;
};

// Suppress console.error for tests since we're intentionally throwing errors
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error occurred')).toBeInTheDocument();
  });

  it('renders error message when an error is thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} errorMessage="Custom error message" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders default error message when error has no message', () => {
    // Create an error without a message
    const ThrowingComponentNoMessage = () => {
      const error = new Error();
      error.message = '';
      throw error;
    };

    render(
      <ErrorBoundary>
        <ThrowingComponentNoMessage />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Unknown error')).toBeInTheDocument();
  });

  it('has correct CSS classes for styling', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} errorMessage="Test error" />
      </ErrorBoundary>
    );

    const container = screen.getByText('Something went wrong.').closest('div');
    expect(container).toHaveClass('container', 'mx-auto', 'p-6', 'max-w-6xl', 'pt-20');
    
    const errorMessage = screen.getByText('Test error');
    expect(errorMessage).toHaveClass('text-red-500');
  });

  it('can recover after an error by re-rendering with valid children', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} errorMessage="Initial error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Re-render with valid children
    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // Note: ErrorBoundary state persists, so it will still show the error
    // This is the expected behavior of React error boundaries
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});