import { Form, Input } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PhotoStatusSectionProps } from './types';

const PhotoStatusSection: FC<PhotoStatusSectionProps> = () => {
  const { t } = useTranslation('components');

  return (
    <div className='mb-6'>
      <Form.Item
        name='photo_url'
        label={t('forms.petForm.photoUrl')}
        rules={[{ max: 500, message: t('forms.petForm.photoUrlMaxLength') }]}
      >
        <Input placeholder={t('forms.petForm.photoUrlPlaceholder')} maxLength={500} />
      </Form.Item>
    </div>
  );
};

export { PhotoStatusSection };
export default PhotoStatusSection;
