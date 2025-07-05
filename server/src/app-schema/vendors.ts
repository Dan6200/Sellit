import joi from 'joi'

export const VendorSchemaID = joi.object({
  vendor_id: joi.string().guid({ version: 'uuidv4' }),
})
