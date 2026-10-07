import { useColorScheme as useRNColorScheme } from 'react-native';

// RN 0.86 can return 'unspecified'; narrow to the keys our Colors map supports.
export function useColorScheme(): 'light' | 'dark' {
  return useRNColorScheme() === 'dark' ? 'dark' : 'light';
}
