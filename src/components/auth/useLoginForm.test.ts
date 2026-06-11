import { renderHook, act } from '@testing-library/react-native';
import { useLoginForm } from './useLoginForm';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const mockCreate = jest.fn();
const mockFinalize = jest.fn();
jest.mock('@clerk/expo', () => ({
  useSignIn: () => ({
    signIn: { create: mockCreate, finalize: mockFinalize, status: 'needs_identifier' },
    errors: { fields: {}, global: [] },
    fetchStatus: 'idle',
  }),
}));

beforeEach(() => {
  mockCreate.mockClear();
});

test('rejette un email invalide sans appeler signIn.create', async () => {
  const { result } = await renderHook(() => useLoginForm());

  await act(async () => {
    result.current.setEmail('abc');
    result.current.setPassword('12345678');
  });

  await act(async () => {
    await result.current.onSignInPress();
  });

  expect(result.current.errorMessage).toBe('Email invalide');
  expect(mockCreate).not.toHaveBeenCalled();
});

test('rejette un mot de passe trop court  sans appeler signIn.create', async () => {
  const { result } = await renderHook(() => useLoginForm());

  await act(async () => {
    result.current.setEmail('ab@c.com');
    result.current.setPassword('1234567');
  });

  await act(async () => {
    await result.current.onSignInPress();
  });

  expect(result.current.errorMessage).toBe('Le mot de passe doit contenir au moins 8 caractères');
  expect(mockCreate).not.toHaveBeenCalled();
});

test('appelle signIn.create avec des identifiants valides', async () => {
  const { result } = await renderHook(() => useLoginForm());

  await act(async () => {
    result.current.setEmail('ab@c.com');
    result.current.setPassword('12345678');
  });

  await act(async () => {
    await result.current.onSignInPress();
  });

  expect(mockCreate).toHaveBeenCalledWith({ identifier: 'ab@c.com', password: '12345678' });
  expect(result.current.errorMessage).toBeUndefined();
});
