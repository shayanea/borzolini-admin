import { TFunction } from 'i18next';
import { z } from 'zod';

export const getLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t('pages:login.enterEmailAddress'))
      .email(t('pages:login.validEmailAddress')),
    password: z
      .string()
      .min(1, t('pages:login.enterPasswordField'))
      .min(8, t('pages:login.passwordMinChars')),
  });

export type LoginSchemaType = z.infer<ReturnType<typeof getLoginSchema>>;
