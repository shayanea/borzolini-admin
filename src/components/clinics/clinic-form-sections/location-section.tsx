import { FC } from 'react';

import { AddressFields } from '@/components/shared';
import { LocationSectionProps } from './types';

const LocationSection: FC<LocationSectionProps> = () => {
  return <AddressFields required={true} showPostalCode={true} useTextArea={false} />;
};

export { LocationSection };
export default LocationSection;
