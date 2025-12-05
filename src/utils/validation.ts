import { Rule } from 'antd/es/form';
import { ZodSchema, ZodTypeAny } from 'zod';

/**
 * Creates an Ant Design Form validator rule from a Zod schema.
 * Useful for validating individual fields against a Zod definition.
 * 
 * @param schema - The Zod schema to validate against (usually a specific field schema like z.string().email())
 * @returns An Ant Design form rule object with a validator function
 */
export const createSchemaFieldRule = (schema: ZodTypeAny | ZodSchema): Rule => ({
  validator: async (_, value) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }
  },
});
