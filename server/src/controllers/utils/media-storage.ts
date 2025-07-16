// cspell:ignore fieldname
///////////////////////////////////////////////////
// Uploads an image file to cloudinary using multer
///////////////////////////////////////////////////
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'production') {
  if (process.env.VERCEL_ENV)
    dotenv.config({ path: `.env.${process.env.VERCEL_ENV}` })
  else dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }
let cloudinaryStorage: CloudinaryStorage | null = null

if (process.env.NODE_ENV === 'testing') {
  cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      use_filename: true,
      folder: 'thrift-app-media-testing',
      unique_filename: true,
      overwrite: true,
      public_id: (_req, file) =>
        `${file.fieldname}-${Math.trunc(Math.random() * 1e9)}`,
    },
  } as Options)
} else {
  cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      use_filename: true,
      folder: 'thrift-app-media',
      unique_filename: true,
      overwrite: true,
      public_id: (_req, file) =>
        `${file.fieldname}-${Math.trunc(Math.random() * 1e9)}`,
    },
  } as Options)
}

export { cloudinaryStorage }
