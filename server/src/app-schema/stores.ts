import joi from 'joi'

export const StoreDataRequestSchema = joi
  .object({
    store_name: joi.string().min(3).max(50).required(),
    store_page: joi.object({
      heading: joi.string().required(),
      theme: joi.string().required(),
      pages: joi.array().items(joi.string()).required(),
      hero: joi.object({
        media: joi.array().items(joi.string()).allow(null),
      }),
      body: joi.object({
        product_listings: joi.object({
          product_ids: joi.array().items(joi.number()),
        }),
      }),
    }),
  })
  .required()

export const StoreDataRequestPartialSchema = joi.object({
  store_name: joi.string().min(3).max(50),
  store_page: joi.object({
    heading: joi.string().required(),
    theme: joi.string().required(),
    pages: joi.array().items(joi.string()).required(),
    hero: joi.object({
      media: joi.array().items(joi.string()).allow(null),
    }),
    body: joi.object({
      product_listings: joi.object({
        product_ids: joi.array().items(joi.number()),
      }),
    }),
  }),
})

export const StoreIDSchema = joi.object({
  store_id: joi.number().required(),
})

export const StoreDataResponseListSchema = joi
  .array()
  .items(
    joi
      .object({
        store_id: joi.number().required(),
        store_name: joi.string().min(3).max(50).required(),
        vendor_id: joi.number().required(),
        store_page: joi.object({
          heading: joi.string().required(),
          theme: joi.string().required(),
          pages: joi.array().items(joi.string()).required(),
          hero: joi.object({
            media: joi.array().items(joi.string()).allow(null),
          }),
          body: joi.object({
            product_listings: joi.object({
              product_ids: joi.array().items(joi.number()),
            }),
          }),
        }),
        date_created: joi
          .alternatives()
          .try(joi.string().required(), joi.date().required()),
      })
      .required(),
  )
  .required()

export const StoreDataResponseSchema = joi
  .object({
    store_id: joi.number().required(),
    store_name: joi.string().min(3).max(50).required(),
    vendor_id: joi.number().required(),
    store_page: joi
      .object({
        heading: joi.string().required(),
        theme: joi.string().required(),
        pages: joi.array().items(joi.string()).required(),
        hero: joi.object({
          media: joi.array().items(joi.string()).allow(null),
        }),
        body: joi.object({
          product_listings: joi.object({
            product_ids: joi.array().items(joi.number()),
          }),
        }),
      })
      .required(),
    date_created: joi
      .alternatives()
      .try(joi.string().required(), joi.date().required()),
  })
  .required()
