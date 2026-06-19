/// <reference types="jest" />
import { act, renderHook } from '@testing-library/react-native';
import type { UserProfile } from '@/types/user.types';
import { useEditProfile } from './useEditProfile';

jest.mock('@clerk/expo', () => ({
  useAuth: () => ({ getToken: async () => 'tok' }),
}));

const mockUpdateProfile = jest.fn();
const mockUploadPicture = jest.fn();
jest.mock('@/services/api/userService', () => ({
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  uploadProfilePicture: (...args: unknown[]) => mockUploadPicture(...args),
}));

function profile(description: string | null = 'bio'): UserProfile {
  return { id: 1, username: 'me', name: 'Me', description, profilePicture: null, isVerify: false };
}

beforeEach(() => {
  mockUpdateProfile.mockReset().mockResolvedValue(profile());
  mockUploadPicture.mockReset().mockResolvedValue(profile());
});

test('save ne fait rien si rien n’a changé', async () => {
  const onSaved = jest.fn();
  const { result } = await renderHook(() => useEditProfile({ profile: profile(), onSaved }));

  expect(result.current.dirty).toBe(false);
  await act(async () => {
    await result.current.save();
  });

  expect(mockUpdateProfile).not.toHaveBeenCalled();
  expect(mockUploadPicture).not.toHaveBeenCalled();
  expect(onSaved).not.toHaveBeenCalled();
});

test('met à jour la description (trim) et notifie onSaved', async () => {
  const onSaved = jest.fn();
  const { result } = await renderHook(() => useEditProfile({ profile: profile('bio'), onSaved }));

  await act(async () => {
    result.current.setDescription('  nouvelle bio  ');
  });
  expect(result.current.dirty).toBe(true);

  await act(async () => {
    await result.current.save();
  });

  expect(mockUpdateProfile).toHaveBeenCalledWith(1, { description: 'nouvelle bio' }, 'tok');
  expect(mockUploadPicture).not.toHaveBeenCalled();
  expect(onSaved).toHaveBeenCalled();
});

test('uploade la photo choisie sans toucher la description inchangée', async () => {
  const onSaved = jest.fn();
  const { result } = await renderHook(() => useEditProfile({ profile: profile('bio'), onSaved }));

  await act(async () => {
    result.current.setPickedImage({ uri: 'file://a.jpg', type: 'IMAGE' });
  });
  await act(async () => {
    await result.current.save();
  });

  expect(mockUploadPicture).toHaveBeenCalledWith(1, { uri: 'file://a.jpg', type: 'IMAGE' }, 'tok');
  expect(mockUpdateProfile).not.toHaveBeenCalled();
  expect(onSaved).toHaveBeenCalled();
});
