import Ajv from 'ajv'

export const validateSchema = (schema: object) => async (data: unknown) => {
  const ajv = new Ajv()
  const valid = ajv.validate(schema, data)
  if (!valid) console.log({ valid, errors: ajv.errors })

  return valid || "Doesn't match schema"
}
