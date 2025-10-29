import React from 'react';
import { useTranslation } from 'react-i18next';

export const SoonBadge: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <span className='text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0'>
      {t('status.soon')}
    </span>
  );
};
