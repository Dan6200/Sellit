import { cloudinary } from '#src/controllers/utils/media-storage.js'
import { knex } from '#src/db/index.js'

const getImagesInFolder = async (folderName: string) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderName, // Folder name
      max_results: 500,
    })
    return result.resources
  } catch (error) {
    console.error('Error fetching images in folder:', error)
  }
}

// const images = await knex.select('filename').from('product_media')
const images = await getImagesInFolder('thrift-app-media')

let count = 0
Promise.all(
  images.map(async (image: any) => {
    const { version } = image
    const filename = image.public_id.split('/')[1].split('.jpg')[0]
    const updated =
      (await knex('product_media')
        .update({ version })
        .where('filename', filename)) > 0
    console.log(count++, updated)
  }),
)
