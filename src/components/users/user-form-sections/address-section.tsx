import { FC } from 'react';

import { AddressFields } from '@/components/shared';
import { AddressSectionProps } from './types';

const AddressSection: FC<AddressSectionProps> = () => {
  return (
    <AddressFields
      required={false}
      showPostalCode={true}
      useTextArea={true}
      names={{
        postalCode: 'postalCode',
      }}
    />
  );
};

export default AddressSection;
