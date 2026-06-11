import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidVerificationCode,
} from './auth.validation';

test('rejette un email sans @', () => {
  expect(isValidEmail('abc')).toBe(false);
});

test('accepte un email valide', () => {
  expect(isValidEmail('a@b.com')).toBe(true);
});

test('rejette un mot de passe trop court', () => {
  expect(isValidPassword('1234567')).toBe(false);
});

test('accepte un mot de passe de 8 caractères ou plus', () => {
  expect(isValidPassword('12345678')).toBe(true);
});

test('rejette un username trop court', () => {
  expect(isValidUsername('za')).toBe(false);
});

test('accepte un username de 3 caractères ou plus ', () => {
  expect(isValidUsername('nabou')).toBe(true);
});

test('rejette un code de vérification trop court', () => {
  expect(isValidVerificationCode('12345')).toBe(false);
});

test('accepte un code de vérification de 6 caractères', () => {
  expect(isValidVerificationCode('123456')).toBe(true);
});
