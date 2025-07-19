import { sanitizeTitle } from '../utils';

describe('sanitizeTitle', () => {
  it('returns empty string for null or undefined input', () => {
    expect(sanitizeTitle(null)).toBe('');
    expect(sanitizeTitle(undefined)).toBe('');
    expect(sanitizeTitle('')).toBe('');
  });

  it('removes simple dollar signs', () => {
    expect(sanitizeTitle('Title with $symbols$')).toBe('Title with symbols');
  });

  it('converts LaTeX superscript notation to simple caret notation', () => {
    expect(sanitizeTitle('CO$^{2}$')).toBe('CO^2');
    expect(sanitizeTitle('H$^{2}$O')).toBe('H^2O');
    expect(sanitizeTitle('x$^{10}$')).toBe('x^10');
  });

  it('handles superscript without braces', () => {
    expect(sanitizeTitle('CO$^2$')).toBe('CO^2');
    expect(sanitizeTitle('x$^5$')).toBe('x^5');
  });

  it('converts escaped hyphens to regular hyphens', () => {
    expect(sanitizeTitle('Some\\-title')).toBe('Some-title');
    expect(sanitizeTitle('Multi\\-word\\-title')).toBe('Multi-word-title');
  });

  it('handles complex titles with multiple formatting issues', () => {
    expect(sanitizeTitle('CO$^{2}$ \\- The $future$ of energy')).toBe('CO^2 - The future of energy');
  });

  it('preserves regular text without special formatting', () => {
    expect(sanitizeTitle('Regular Title')).toBe('Regular Title');
    expect(sanitizeTitle('Simple text with spaces')).toBe('Simple text with spaces');
  });

  it('handles edge cases with multiple superscripts', () => {
    expect(sanitizeTitle('H$^{2}$O + CO$^{2}$ equation')).toBe('H^2O + CO^2 equation');
  });

  it('handles mixed case scenarios', () => {
    expect(sanitizeTitle('$Complex$ title with $^{3}$ and \\- formatting')).toBe('Complex title with ^3 and - formatting');
  });
});