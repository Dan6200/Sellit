import { cloudinary } from '@/controllers/utils/media-storage.js'
import fs from 'fs/promises'
// import path from 'path'

async function bulkUpload() {
  const dir = 'media/images/'
  const files = await fs.readdir(dir)
  try {
    const uploadPromises = files.map((file) => {
      return cloudinary.uploader.upload(dir + file, {
        folder: 'thrift-app-media',
        public_id: file,
        // public_id: path.parse(file).name // Cloudinary appends .jpg use this to remove .jpg from filename
      })
    })
    const results = await Promise.all(uploadPromises)
    console.log('Uploaded files: ', results)
  } catch (err) {
    console.error('Error Bulk uploading files', err)
  }
}

bulkUpload()
