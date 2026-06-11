import { renderHook, act } from '@testing-library/react-native';
import { useRegisterForm } from './useRegisterForm';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({ replace: mockReplace }),
}));

const mockCreate = jest.fn();
const mockSendEmailCode = jest.fn();
const mockVerifyEmailCode = jest.fn();
const mockFinalize = jest.fn();
const mockGetToken = jest.fn();
let mockingSignUpStatus = 'needs_first_factor'

jest.mock('@clerk/expo', () => ({
    useSignUp: () => ({
        signUp: {
            create: mockCreate,
            verifications: {
                sendEmailCode: mockSendEmailCode,
                verifyEmailCode: mockVerifyEmailCode,
            },
            finalize: mockFinalize,
            get status() { return mockingSignUpStatus },
        },
        errors: { fields: {}, global: [] },
        fetchStatus: 'idle',
    }),
    useAuth: () => ({ getToken: mockGetToken }),
}));

beforeEach(() => {
    mockCreate.mockClear();
    mockSendEmailCode.mockClear();
    mockVerifyEmailCode.mockClear();
    mockFinalize.mockClear();
    mockReplace.mockClear();
    mockingSignUpStatus = 'needs_first_factor';
});

test('rejette un pseudo trop court sans appeler signUp.create', async () => {
    const { result } = await renderHook(() => useRegisterForm());

    await act(async () => {
        result.current.setUsername('ab');
        result.current.setEmail('a@b.com');
        result.current.setPassword('12345678');
    });

    await act(async () => {
        await result.current.onSignUpPress();
    });

    expect(result.current.errorMessage).toBe('Le pseudo doit contenir au moins 3 caractères');
    expect(mockCreate).not.toHaveBeenCalled();
});

test('rejette un email invalide sans appeler signUp.create', async () => {
    const { result } = await renderHook(() => useRegisterForm());

    await act(async () => {
        result.current.setUsername('nabou');
        result.current.setEmail('abc');
        result.current.setPassword('12345678');
    });

    await act(async () => {
        await result.current.onSignUpPress();
    });

    expect(result.current.errorMessage).toBe('Email invalide');
    expect(mockCreate).not.toHaveBeenCalled();
});

test('rejette un mot de passe trop court sans appeler signUp.create', async () => {
    const { result } = await renderHook(() => useRegisterForm());

    await act(async () => {
        result.current.setUsername('nabou');
        result.current.setEmail('a@b.com');
        result.current.setPassword('1234567');
    });

    await act(async () => {
        await result.current.onSignUpPress();
    });

    expect(result.current.errorMessage).toBe('Le mot de passe doit contenir au moins 8 caractères');
    expect(mockCreate).not.toHaveBeenCalled();
});

test('appelle signUp.create et sendEmailCode avec des identifiants valides', async () => {
    mockCreate.mockResolvedValue({ error: undefined });
    mockSendEmailCode.mockResolvedValue({ error: undefined });

    const { result } = await renderHook(() => useRegisterForm());

    await act(async () => {
        result.current.setUsername('nabou');
        result.current.setEmail('a@b.com');
        result.current.setPassword('12345678');
    });

    await act(async () => {
        await result.current.onSignUpPress();
    });

    expect(mockCreate).toHaveBeenCalledWith({ emailAddress: 'a@b.com', password: '12345678' });
    expect(mockSendEmailCode).toHaveBeenCalled();
    expect(result.current.pendingVerification).toBe(true);
});

test('rejette un code de vérification invalide', async () => {
    mockCreate.mockResolvedValue({ error: undefined });
    mockSendEmailCode.mockResolvedValue({ error: undefined });

    const { result } = await renderHook(() => useRegisterForm());

    await act(async () => {
        result.current.setUsername('nabou');
        result.current.setEmail('a@b.com');
        result.current.setPassword('12345678');
    });
    await act(async () => {
        await result.current.onSignUpPress();
    });

    await act(async () => {
        result.current.setCode('123');
    });
    await act(async () => {
        await result.current.onVerifyPress();
    });

    expect(result.current.errorMessage).toBe('Le code doit contenir 6 chiffres');
    expect(mockVerifyEmailCode).not.toHaveBeenCalled();
});

test('finalise l\'inscription, synchronise le backend et redirige', async () =>{
    mockCreate.mockResolvedValue({ error: undefined });
    mockSendEmailCode.mockResolvedValue({ error: undefined });
    mockVerifyEmailCode.mockImplementation(async () =>{
        mockingSignUpStatus = 'complete';
        return { error: undefined };
    })
    mockGetToken.mockResolvedValue('token123');
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
    }) as jest.Mock;

    const { result } = await renderHook(() => useRegisterForm());
    
    await act(async () =>{
        result.current.setUsername('nabou');
        result.current.setEmail('a@b.com');
        result.current.setPassword('12345678');
    })

    await act(async () => {
        await result.current.onSignUpPress();
    });

    await act(async () => {
        result.current.setCode('123456');
    });
    await act(async () => {
        await result.current.onVerifyPress();
    });

    expect(mockFinalize).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/(app)/(tabs)/home');

}) 