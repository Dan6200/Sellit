import { cloudinary } from '#src/controllers/utils/media-storage.js'
import fs from 'fs/promises'

async function bulkUpload() {
  const dir = 'generated_images/'
  const files = await fs.readdir(dir)
  try {
    const uploadPromises = files.map((file) => {
      return cloudinary.uploader.upload(dir + file, {
        folder: 'sellit-media',
        public_id: file.split('.')[0],
      })
    })
    const results = await Promise.all(uploadPromises)
    console.log(
      'Uploaded files: ',
      results.map((result) => result.public_id),
    )
  } catch (err) {
    console.error('Error Bulk uploading files', err)
  }
}

bulkUpload()
