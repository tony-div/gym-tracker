import { launchImageLibrary } from "react-native-image-picker";

export const pickMedia = async (mediaType: 'photo' | 'video') => {
  const result = await launchImageLibrary({mediaType});
  if(result.didCancel) return;
  return result.assets![0];
}