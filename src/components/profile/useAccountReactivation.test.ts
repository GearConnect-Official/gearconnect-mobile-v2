/// <reference types="jest" />
import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import {
  formatDeletionDate,
  getDeletionDate,
  useAccountReactivation,
} from './useAccountReactivation';

const mockGetToken = jest.fn();
const mockSignOut = jest.fn();
const mockReload = jest.fn();
let mockMetadata: Record<string, unknown> = {};
jest.mock('@clerk/expo', () => ({
  useAuth: () => ({ getToken: mockGetToken, signOut: mockSignOut }),
  useUser: () => ({ user: { publicMetadata: mockMetadata, reload: mockReload } }),
}));

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }) }));

const mockReactivate = jest.fn();
jest.mock('@/services/api/authService', () => ({
  reactivateAccount: (...args: unknown[]) => mockReactivate(...args),
}));

const alertSpy = jest.spyOn(Alert, 'alert');

beforeEach(() => {
  alertSpy.mockReset();
  mockGetToken.mockReset().mockResolvedValue('tok');
  mockSignOut.mockReset();
  mockReload.mockReset().mockResolvedValue(undefined);
  mockReplace.mockReset();
  mockReactivate.mockReset().mockResolvedValue(undefined);
  mockMetadata = { deletionScheduledAt: '2026-10-23T10:00:00.000Z' };
});

test('getDeletionDate lit la date prévue dans les métadonnées', () => {
  expect(getDeletionDate({ deletionScheduledAt: '2026-10-23T10:00:00.000Z' })).toEqual(
    new Date('2026-10-23T10:00:00.000Z'),
  );
});

test('getDeletionDate renvoie null sans suppression prévue ou date invalide', () => {
  expect(getDeletionDate(undefined)).toBeNull();
  expect(getDeletionDate({})).toBeNull();
  expect(getDeletionDate({ deletionScheduledAt: 'pas-une-date' })).toBeNull();
});

test('formatDeletionDate écrit la date en toutes lettres', () => {
  expect(formatDeletionDate(new Date(2026, 9, 23))).toBe('23 octobre 2026');
});

test('expose la date de suppression du compte connecté', async () => {
  const { result } = await renderHook(() => useAccountReactivation());

  expect(result.current.deletionDate).toEqual(new Date('2026-10-23T10:00:00.000Z'));
});

test('réactiver appelle l’API, recharge l’utilisateur puis renvoie vers l’app', async () => {
  const { result } = await renderHook(() => useAccountReactivation());

  await act(async () => {
    await result.current.reactivate();
  });

  expect(mockReactivate).toHaveBeenCalledWith('tok');
  expect(mockReload).toHaveBeenCalled();
  expect(mockReplace).toHaveBeenCalledWith('/(app)/(tabs)/home');
  expect(result.current.reactivating).toBe(false);
});

test('affiche une erreur et reste sur l’écran si l’API échoue', async () => {
  mockReactivate.mockRejectedValue(new Error('Impossible de réactiver le compte.'));
  const { result } = await renderHook(() => useAccountReactivation());

  await act(async () => {
    await result.current.reactivate();
  });

  expect(alertSpy).toHaveBeenCalledWith('Échec', 'Impossible de réactiver le compte.');
  expect(mockReplace).not.toHaveBeenCalled();
});
