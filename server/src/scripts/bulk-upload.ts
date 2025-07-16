import { cloudinary } from '#src/controllers/utils/media-storage.js'
import fs from 'fs/promises'

async function bulkUpload(dir: string) {
  const files = await fs.readdir(dir)
  const folder = 'sellit-media'
  try {
    const uploadPromises = files.map(async (file) => {
      const publicId = folder + '/' + file.split('.')[0]
      try {
        // Check if the resource already exists
        await cloudinary.api.resource(publicId)
        console.log(`Skipping ${file}: already exists in Cloudinary.`)
        return null // Indicate that this file was skipped
      } catch (reject: unknown) {
        const { error } = reject as {
          error: { message: string; http_code: number }
        }
        // If resource not found (404), proceed with upload
        if (
          typeof error === 'object' &&
          error !== null &&
          'http_code' in error &&
          (error as { http_code: number }).http_code === 404
        ) {
          console.log(`Uploading ${file}...`)
          return cloudinary.uploader.upload(dir + '/' + file, {
            public_id: publicId,
          })
        } else {
          // Other error, re-throw
          throw error
        }
      }
    })
    const results = await Promise.all(uploadPromises)
    const uploadedResults = results.filter(Boolean) // Filter out nulls (skipped files)
    console.log(
      'Uploaded files: ',
      uploadedResults.map((result) => result.public_id),
    )
  } catch (err) {
    console.error('Error Bulk uploading files', err)
  }
}

bulkUpload(process.argv[2])
