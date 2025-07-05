import joi from 'joi'

export const CustomerSchemaID = joi.object({
  customer_id: joi.string().guid({ version: 'uuidv4' }),
})
