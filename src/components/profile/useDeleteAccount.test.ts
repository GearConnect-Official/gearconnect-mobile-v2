/// <reference types="jest" />
import { act, renderHook } from '@testing-library/react-native';
import { Alert, type AlertButton } from 'react-native';
import { useDeleteAccount } from './useDeleteAccount';

interface Pending {
  level: string | undefined;
  complete: () => void;
  cancel: () => void;
}

const mockSignOut = jest.fn();
const mockGetToken = jest.fn();
const mockStartVerification = jest.fn();
const mockAttemptFirstFactor = jest.fn();
let mockOnNeedsReverification: ((p: Pending) => void) | undefined;
jest.mock('@clerk/expo', () => ({
  useAuth: () => ({ getToken: mockGetToken, signOut: mockSignOut }),
  useSession: () => ({
    session: {
      startVerification: mockStartVerification,
      attemptFirstFactorVerification: mockAttemptFirstFactor,
    },
  }),
  // Sans exigence de l'API, la vérification d'identité laisse passer l'appel tel quel.
  useReverification: (
    fetcher: () => Promise<unknown>,
    options?: { onNeedsReverification?: (p: Pending) => void },
  ) => {
    mockOnNeedsReverification = options?.onNeedsReverification;
    return fetcher;
  },
  isClerkRuntimeError: (e: unknown) =>
    (e as { clerkRuntimeError?: boolean })?.clerkRuntimeError === true,
  isClerkAPIResponseError: (e: unknown) =>
    (e as { clerkAPIResponseError?: boolean })?.clerkAPIResponseError === true,
}));

const mockDeleteAccount = jest.fn();
jest.mock('@/services/api/authService', () => ({
  deleteAccount: (...args: unknown[]) => mockDeleteAccount(...args),
}));

const alertSpy = jest.spyOn(Alert, 'alert');

/** Simule l'appui sur un bouton de la dernière Alert affichée. */
async function press(label: string) {
  const buttons = alertSpy.mock.calls.at(-1)?.[2] as AlertButton[] | undefined;
  await act(async () => {
    await buttons?.find((b) => b.text === label)?.onPress?.();
  });
}

/** Simule Clerk qui demande une vérification d'identité. */
async function requestVerification(pending: Pending) {
  await act(async () => {
    mockOnNeedsReverification?.(pending);
  });
}

beforeEach(() => {
  alertSpy.mockReset();
  mockSignOut.mockReset().mockResolvedValue(undefined);
  mockGetToken.mockReset().mockResolvedValue('tok');
  mockDeleteAccount.mockReset().mockResolvedValue(undefined);
  mockStartVerification.mockReset().mockResolvedValue({});
  mockAttemptFirstFactor.mockReset().mockResolvedValue({ status: 'complete' });
});

test('demande une confirmation sans rien supprimer', async () => {
  const { result } = await renderHook(() => useDeleteAccount());

  await act(async () => {
    result.current.confirmDeletion();
  });

  expect(alertSpy).toHaveBeenCalledWith(
    'Supprimer le compte',
    expect.stringContaining('15 jours'),
    expect.any(Array),
  );
  expect(mockDeleteAccount).not.toHaveBeenCalled();
});

test('Annuler ne supprime pas le compte', async () => {
  const { result } = await renderHook(() => useDeleteAccount());

  await act(async () => {
    result.current.confirmDeletion();
  });
  await press('Annuler');

  expect(mockDeleteAccount).not.toHaveBeenCalled();
  expect(mockSignOut).not.toHaveBeenCalled();
});

test('Supprimer appelle l’API avec le token puis déconnecte', async () => {
  const { result } = await renderHook(() => useDeleteAccount());

  await act(async () => {
    result.current.confirmDeletion();
  });
  await press('Supprimer');

  expect(mockDeleteAccount).toHaveBeenCalledWith('tok');
  expect(mockSignOut).toHaveBeenCalled();
  expect(result.current.deleting).toBe(false);
});

test('affiche une erreur et reste connecté si l’API échoue', async () => {
  mockDeleteAccount.mockRejectedValue(new Error('Impossible de supprimer le compte.'));
  const { result } = await renderHook(() => useDeleteAccount());

  await act(async () => {
    result.current.confirmDeletion();
  });
  await press('Supprimer');

  expect(alertSpy).toHaveBeenLastCalledWith('Échec', 'Impossible de supprimer le compte.');
  expect(mockSignOut).not.toHaveBeenCalled();
});

test('ne montre pas d’erreur si la vérification d’identité est annulée', async () => {
  mockDeleteAccount.mockRejectedValue({
    clerkRuntimeError: true,
    code: 'reverification_cancelled',
  });
  const { result } = await renderHook(() => useDeleteAccount());

  await act(async () => {
    result.current.confirmDeletion();
  });
  await press('Supprimer');

  expect(alertSpy).not.toHaveBeenCalledWith('Échec', expect.anything());
  expect(mockSignOut).not.toHaveBeenCalled();
});

test('ouvre la vérification quand Clerk la demande, puis la valide avec le mot de passe', async () => {
  const pending = { level: 'first_factor', complete: jest.fn(), cancel: jest.fn() };
  const { result } = await renderHook(() => useDeleteAccount());

  await requestVerification(pending);
  expect(result.current.needsVerification).toBe(true);

  await act(async () => {
    await result.current.verifyPassword('secret');
  });

  expect(mockStartVerification).toHaveBeenCalledWith({ level: 'first_factor' });
  expect(mockAttemptFirstFactor).toHaveBeenCalledWith({ strategy: 'password', password: 'secret' });
  expect(pending.complete).toHaveBeenCalled();
  expect(result.current.needsVerification).toBe(false);
});

test('mot de passe faux : message en français et la modale reste ouverte', async () => {
  mockAttemptFirstFactor.mockRejectedValue({ clerkAPIResponseError: true });
  const pending = { level: 'first_factor', complete: jest.fn(), cancel: jest.fn() };
  const { result } = await renderHook(() => useDeleteAccount());

  await requestVerification(pending);
  await act(async () => {
    await result.current.verifyPassword('faux');
  });

  expect(result.current.verificationError).toBe('Mot de passe incorrect.');
  expect(result.current.needsVerification).toBe(true);
  expect(pending.complete).not.toHaveBeenCalled();
});

test('vérification incomplète (2FA) : ne valide pas', async () => {
  mockAttemptFirstFactor.mockResolvedValue({ status: 'needs_second_factor' });
  const pending = { level: 'second_factor', complete: jest.fn(), cancel: jest.fn() };
  const { result } = await renderHook(() => useDeleteAccount());

  await requestVerification(pending);
  await act(async () => {
    await result.current.verifyPassword('secret');
  });

  expect(result.current.verificationError).toBe('Une vérification supplémentaire est requise.');
  expect(pending.complete).not.toHaveBeenCalled();
});

test('annuler la vérification prévient Clerk et ferme la modale', async () => {
  const pending = { level: 'first_factor', complete: jest.fn(), cancel: jest.fn() };
  const { result } = await renderHook(() => useDeleteAccount());

  await requestVerification(pending);
  await act(async () => {
    result.current.cancelVerification();
  });

  expect(pending.cancel).toHaveBeenCalled();
  expect(result.current.needsVerification).toBe(false);
});
