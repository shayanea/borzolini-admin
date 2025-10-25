import { Select } from 'antd';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  // Add more languages later
  // { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  // { code: 'ar', name: 'العربية', flag: '🇸🇦' },
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
      style={{ width: 140 }}
      bordered={false}
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
