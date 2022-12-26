import Ajv from 'ajv'

export const validateSchema = (schema: object) => async (data: unknown) => {
  const ajv = new Ajv()
  const valid = ajv.validate(schema, data)
  return valid || "Doesn't match schema"
}
