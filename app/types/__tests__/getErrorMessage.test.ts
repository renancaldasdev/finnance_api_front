import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '../index';

describe('getErrorMessage', () => {
  it('handles string errors', () => {
    expect(getErrorMessage('test error')).toBe('test error');
  });

  it('handles Error objects', () => {
    expect(getErrorMessage(new Error('error message'))).toBe('error message');
  });

  it('handles objects with message property', () => {
    expect(getErrorMessage({ message: 'object message' })).toBe('object message');
  });

  it('returns Unknown error for unsupported types', () => {
    expect(getErrorMessage(null)).toBe('Unknown error');
    expect(getErrorMessage(undefined)).toBe('Unknown error');
    expect(getErrorMessage(123)).toBe('Unknown error');
    expect(getErrorMessage({})).toBe('Unknown error');
  });
});
