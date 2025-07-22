// cspell:ignore alphanum
import joi from 'joi'

export const DeliveryInfoRequestSchema = joi
  .object({
    recipient_full_name: joi.string().min(3).max(60).required(),
    address_line_1: joi.string().required(),
    address_line_2: joi.string().allow('').required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip_postal_code: joi.string().required(),
    country: joi.string().required(),
    phone_number: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
      )
      .required(),
    delivery_instructions: joi.string().required(),
  })
  .required()

export const DeliveryInfoSchemaID = joi
  .object({
    delivery_info_id: joi.number().required(),
    created_at: joi.date().required(),
    updated_at: joi.date().required(),
    deleted_at: joi.date().optional(),
  })
  .required()

export const DeliveryInfoResponseSchema = joi
  .object({
    delivery_info_id: joi.number().required(),
    recipient_full_name: joi.string().min(3).max(60).required(),
    address_id: joi.number().required(),
    address_line_1: joi.string().required(),
    address_line_2: joi.string().allow('').required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip_postal_code: joi.string().required(),
    country: joi.string().required(),
    phone_number: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
      )
      .required(),
    delivery_instructions: joi.string().required(),
    created_at: joi.date().required(),
    updated_at: joi.date().required(),
  })
  .required()

export const DeliveryInfoResponseListSchema = joi.array().items(
  joi
    .object({
      delivery_info_id: joi.number().required(),
      recipient_full_name: joi.string().min(3).max(60).required(),
      address_id: joi.number().required(),
      address_line_1: joi.string().required(),
      address_line_2: joi.string().allow('').required(),
      city: joi.string().required(),
      state: joi.string().required(),
      zip_postal_code: joi.string().required(),
      country: joi.string().required(),
      phone_number: joi
        .string()
        .pattern(
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
        )
        .required(),
      delivery_instructions: joi.string().required(),
      created_at: joi.date().required(),
      updated_at: joi.date().required(),
    })
    .required(),
)
