import { Globe } from 'lucide-react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr-CA', name: 'Français', flag: '🇨🇦' },
  { code: 'es-US', name: 'Español', flag: '🇲🇽' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string): void => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      style={{ width: 130 }}
      variant='borderless'
      suffixIcon={<Globe size={16} />}
    >
      {languages.map(lang => (
        <Select.Option key={lang.code} value={lang.code}>
          <span className='flex items-center gap-2'>
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </span>
        </Select.Option>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
