import { useTranslation } from 'react-i18next';

export const useValidationMessages = () => {
  const { t } = useTranslation('validation');

  return {
    // Common
    REQUIRED: t('common.required'),
    INVALID_EMAIL: t('common.invalidEmail'),
    INVALID_URL: t('common.invalidUrl'),
    INVALID_PHONE: t('common.invalidPhone'),
    INVALID_POSTAL_CODE: t('common.invalidPostalCode'),
    POSITIVE_NUMBER: t('common.positiveNumber'),

    // User form
    FIRST_NAME_REQUIRED: t('user.firstNameRequired'),
    LAST_NAME_REQUIRED: t('user.lastNameRequired'),
    EMAIL_REQUIRED: t('user.emailRequired'),
    PASSWORD_REQUIRED: t('user.passwordRequired'),
    PASSWORD_MIN_LENGTH: t('user.passwordMinLength'),
    ROLE_REQUIRED: t('user.roleRequired'),

    // Pet form
    PET_NAME_REQUIRED: t('pet.nameRequired'),
    PET_NAME_MIN_LENGTH: t('pet.nameMinLength'),
    PET_NAME_MAX_LENGTH: t('pet.nameMaxLength'),
    SPECIES_REQUIRED: t('pet.speciesRequired'),
    GENDER_REQUIRED: t('pet.genderRequired'),
    SIZE_REQUIRED: t('pet.sizeRequired'),
    DOB_REQUIRED: t('pet.dobRequired'),
    BREED_MAX_LENGTH: t('pet.breedMaxLength'),
    COLOR_MAX_LENGTH: t('pet.colorMaxLength'),
    MICROCHIP_MAX_LENGTH: t('pet.microchipMaxLength'),
    EMERGENCY_CONTACT_REQUIRED: t('pet.emergencyContactRequired'),
    EMERGENCY_CONTACT_MAX_LENGTH: t('pet.emergencyContactMaxLength'),
    EMERGENCY_PHONE_REQUIRED: t('pet.emergencyPhoneRequired'),
    EMERGENCY_PHONE_MAX_LENGTH: t('pet.emergencyPhoneMaxLength'),
    PHOTO_URL_MAX_LENGTH: t('pet.photoUrlMaxLength'),
    WEIGHT_INVALID: t('pet.weightInvalid'),

    // Clinic form
    CLINIC_NAME_REQUIRED: t('clinic.nameRequired'),
    CLINIC_NAME_MIN_LENGTH: t('clinic.nameMinLength'),
    ADDRESS_REQUIRED: t('clinic.addressRequired'),
    ADDRESS_MIN_LENGTH: t('clinic.addressMinLength'),
    CITY_REQUIRED: t('clinic.cityRequired'),
    CITY_MIN_LENGTH: t('clinic.cityMinLength'),
    COUNTRY_REQUIRED: t('clinic.countryRequired'),
    DESCRIPTION_MAX_LENGTH: t('clinic.descriptionMaxLength'),

    // Appointment form
    APPOINTMENT_TYPE_REQUIRED: t('appointment.typeRequired'),
    PET_REQUIRED: t('appointment.petRequired'),
    CLINIC_REQUIRED: t('appointment.clinicRequired'),
    DATE_REQUIRED: t('appointment.dateRequired'),
    TIME_REQUIRED: t('appointment.timeRequired'),
    REASON_REQUIRED: t('appointment.reasonRequired'),
    TELEMEDICINE_LINK_REQUIRED: t('appointment.telemedicineLinkRequired'),
    HOME_VISIT_ADDRESS_REQUIRED: t('appointment.homeVisitAddressRequired'),

    // Case form
    CASE_TITLE_REQUIRED: t('case.titleRequired'),
    CASE_TYPE_REQUIRED: t('case.typeRequired'),
    CASE_DESCRIPTION_REQUIRED: t('case.descriptionRequired'),
  };
};
