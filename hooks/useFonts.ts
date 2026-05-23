import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts as useExpoFonts } from 'expo-font';

export const useAppFonts = () => {
  const [loaded] = useExpoFonts({
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });
  return loaded;
};