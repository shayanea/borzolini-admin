import { Col, Form, Input, Row } from 'antd';
import { MIN_LENGTH_RULE, REQUIRED_RULE, createPostalCodeRule } from '@/constants/form-validation';

import { FC } from 'react';
import { useValidationMessages } from '@/hooks/use-validation-messages';

const { TextArea } = Input;

interface AddressFieldsProps {
  /**
   * Whether all fields are required
   */
  required?: boolean;
  /**
   * Whether to show postal code field
   */
  showPostalCode?: boolean;
  /**
   * Whether to use textarea for address (default: true)
   */
  useTextArea?: boolean;
  /**
   * Custom labels for fields
   */
  labels?: {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  /**
   * Custom placeholders for fields
   */
  placeholders?: {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  /**
   * Custom field names
   */
  names?: {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  /**
   * Minimum length for address field
   */
  addressMinLength?: number;
  /**
   * Minimum length for city field
   */
  cityMinLength?: number;
  /**
   * Whether fields are disabled
   */
  disabled?: boolean;
  /**
   * Custom validation messages
   */
  validationMessages?: {
    addressRequired?: string;
    addressMinLength?: string;
    cityRequired?: string;
    cityMinLength?: string;
    countryRequired?: string;
  };
}

const AddressFields: FC<AddressFieldsProps> = ({
  required = false,
  showPostalCode = true,
  useTextArea = true,
  labels = {},
  placeholders = {},
  names = {},
  addressMinLength = 5,
  cityMinLength = 2,
  disabled = false,
  validationMessages: customValidationMessages = {},
}) => {
  const validationMessages = useValidationMessages();

  const fieldLabels = {
    address: labels.address ?? 'Address',
    city: labels.city ?? 'City',
    country: labels.country ?? 'Country',
    postalCode: labels.postalCode ?? 'Postal Code',
  };

  const fieldPlaceholders = {
    address: placeholders.address ?? 'Enter full address',
    city: placeholders.city ?? 'Enter city',
    country: placeholders.country ?? 'Enter country',
    postalCode: placeholders.postalCode ?? 'Enter postal code',
  };

  const fieldNames = {
    address: names.address ?? 'address',
    city: names.city ?? 'city',
    country: names.country ?? 'country',
    postalCode: names.postalCode ?? 'postal_code',
  };

  const addressRules = required
    ? [
        REQUIRED_RULE(
          customValidationMessages.addressRequired ?? validationMessages.ADDRESS_REQUIRED
        ),
        MIN_LENGTH_RULE(
          addressMinLength,
          customValidationMessages.addressMinLength ?? validationMessages.ADDRESS_MIN_LENGTH
        ),
      ]
    : [
        MIN_LENGTH_RULE(
          addressMinLength,
          customValidationMessages.addressMinLength ?? validationMessages.ADDRESS_MIN_LENGTH
        ),
      ];

  const cityRules = required
    ? [
        REQUIRED_RULE(customValidationMessages.cityRequired ?? validationMessages.CITY_REQUIRED),
        MIN_LENGTH_RULE(
          cityMinLength,
          customValidationMessages.cityMinLength ?? validationMessages.CITY_MIN_LENGTH
        ),
      ]
    : [
        MIN_LENGTH_RULE(
          cityMinLength,
          customValidationMessages.cityMinLength ?? validationMessages.CITY_MIN_LENGTH
        ),
      ];

  const countryRules = required
    ? [
        REQUIRED_RULE(
          customValidationMessages.countryRequired ?? validationMessages.COUNTRY_REQUIRED
        ),
      ]
    : [];

  const postalCodeRules = [createPostalCodeRule(validationMessages.INVALID_POSTAL_CODE)];

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name={fieldNames.address} label={fieldLabels.address} rules={addressRules}>
            {useTextArea ? (
              <TextArea
                placeholder={fieldPlaceholders.address}
                rows={2}
                disabled={disabled}
                autoComplete='street-address'
              />
            ) : (
              <Input
                placeholder={fieldPlaceholders.address}
                disabled={disabled}
                autoComplete='street-address'
              />
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={showPostalCode ? 8 : 12}>
          <Form.Item name={fieldNames.city} label={fieldLabels.city} rules={cityRules}>
            <Input
              placeholder={fieldPlaceholders.city}
              disabled={disabled}
              autoComplete='address-level2'
            />
          </Form.Item>
        </Col>

        <Col span={showPostalCode ? 8 : 12}>
          <Form.Item name={fieldNames.country} label={fieldLabels.country} rules={countryRules}>
            <Input
              placeholder={fieldPlaceholders.country}
              disabled={disabled}
              autoComplete='country-name'
            />
          </Form.Item>
        </Col>

        {showPostalCode && (
          <Col span={8}>
            <Form.Item
              name={fieldNames.postalCode}
              label={fieldLabels.postalCode}
              rules={postalCodeRules}
            >
              <Input
                placeholder={fieldPlaceholders.postalCode}
                disabled={disabled}
                autoComplete='postal-code'
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </>
  );
};

export default AddressFields;
