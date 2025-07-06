import { cloudinary } from '@/controllers/utils/media-storage.js'

export async function bulkDeleteImages() {
  while (true) {
    try {
      const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'thrift-app-media-testing',
        max_results: 100,
      })
      const publicIds = resources.map((resource: any) => resource.public_id)
      if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds)
      } else {
        console.log('No assets found in the folder')
        break
      }
    } catch (err) {
      console.error('Error deleting assets: ', err)
    }
  }
}
