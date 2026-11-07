import { describe, it, expect } from 'vitest';

// Validators from login.vue
const validateEmail = (email: string): string | null => {
  if (!email) return 'E-mail é obrigatório';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'E-mail inválido';
  return null;
};

const validatePassword = (password: string, minLength = 8): string | null => {
  if (!password) return 'Senha é obrigatória';
  if (password.length < minLength) return `Senha deve ter pelo menos ${minLength} caracteres`;
  return null;
};

const validateName = (name: string): string | null => {
  if (!name) return 'Nome é obrigatório';
  if (name.length < 3) return 'Nome deve ter pelo menos 3 caracteres';
  return null;
};

describe('login form validators', () => {
  describe('validateEmail', () => {
    it('should reject empty email', () => {
      expect(validateEmail('')).toBe('E-mail é obrigatório');
    });

    it('should reject email without @', () => {
      expect(validateEmail('invalidemail.com')).toBe('E-mail inválido');
    });

    it('should reject email without domain', () => {
      expect(validateEmail('invalid@')).toBe('E-mail inválido');
    });

    it('should reject email with spaces', () => {
      expect(validateEmail('invalid @example.com')).toBe('E-mail inválido');
    });

    it('should accept valid email', () => {
      expect(validateEmail('user@example.com')).toBeNull();
    });

    it('should accept valid email with multiple parts', () => {
      expect(validateEmail('user.name+tag@example.co.uk')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('should reject empty password', () => {
      expect(validatePassword('')).toBe('Senha é obrigatória');
    });

    it('should reject password too short', () => {
      expect(validatePassword('short')).toBe('Senha deve ter pelo menos 8 caracteres');
    });

    it('should accept exactly 8 characters', () => {
      expect(validatePassword('12345678')).toBeNull();
    });

    it('should accept strong password', () => {
      expect(validatePassword('MyStr0ng!Pass')).toBeNull();
    });

    it('should respect custom minLength parameter', () => {
      expect(validatePassword('short', 10)).toBe('Senha deve ter pelo menos 10 caracteres');
    });
  });

  describe('validateName', () => {
    it('should reject empty name', () => {
      expect(validateName('')).toBe('Nome é obrigatório');
    });

    it('should reject name too short', () => {
      expect(validateName('ab')).toBe('Nome deve ter pelo menos 3 caracteres');
    });

    it('should accept exactly 3 characters', () => {
      expect(validateName('abc')).toBeNull();
    });

    it('should accept long name', () => {
      expect(validateName('John Doe Smith')).toBeNull();
    });

    it('should accept name with spaces', () => {
      expect(validateName('João da Silva')).toBeNull();
    });

    it('should accept name with accents', () => {
      expect(validateName('José')).toBeNull();
    });
  });
});
