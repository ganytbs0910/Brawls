import { useSettingsScreenTranslation } from '../i18n/settingsScreen';
import { CHARACTER_NAMES, JAPANESE_TO_ENGLISH_MAP } from '../data/characterCompatibility';

export const useCharacterLocalization = () => {
  const { currentLanguage } = useSettingsScreenTranslation();
  
  const getLocalizedName = (characterName: string) => {
    const englishKey = JAPANESE_TO_ENGLISH_MAP[characterName] || characterName.toLowerCase();
    return CHARACTER_NAMES[englishKey]?.[currentLanguage] || characterName;
  };

  return { getLocalizedName, currentLanguage };
};