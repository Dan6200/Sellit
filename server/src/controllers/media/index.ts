//cspell:ignore originalname
import { StatusCodes } from 'http-status-codes'
import BadRequestError from '../../errors/bad-request.js'
import { knex } from '../../db/index.js'

const uploadProductMedia = async (req: any, res: any) => {
  const { product_id } = req.query
  let { descriptions, is_display_image, is_landing_image, is_video } = req.body

  if (descriptions) descriptions = JSON.parse(descriptions)
  if (is_display_image) is_display_image = JSON.parse(is_display_image)
  if (is_landing_image) is_landing_image = JSON.parse(is_landing_image)
  if (is_video) is_video = JSON.parse(is_video)
  else throw new BadRequestError('No descriptions provided')

  let files = <any>await Promise.all(
    req.files.map(async (file: any) => {
      const { filename, originalname, path: filepath } = file
      // Returns filename as Id instead of product_id
      return knex('product_media')
        .insert({
          product_id,
          filename,
          filepath,
          description: descriptions[originalname],
          is_display_image: is_display_image[originalname],
          is_landing_image: is_landing_image[originalname],
          is_video: is_video[originalname],
        })
        .returning('filename')
    }),
  )
  res.status(StatusCodes.CREATED).send(files)
}

export { uploadProductMedia }
