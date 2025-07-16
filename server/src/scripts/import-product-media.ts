import fs from 'fs'
import { parse } from 'fast-csv'
import { knex } from '../db/index.js'

async function importProducts(filePath: string) {
  const mediaToInsert: any[] = []
  const originalRecords: any[] = [] // To store original records for linking with IDs
  const batchSize = 1000

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      headers: true,
      delimiter: '\t',
    }),
  )

  try {
    for await (const record of parser) {
      mediaToInsert.push({
        product_id: record.product_id,
        filename: record.filename,
        filepath: record.filepath,
        description: record.description,
        is_display_image:
          record.is_display_image === 'true' || record.is_display_image === 't',
        is_landing_image:
          record.is_landing_image === 'true' || record.is_landing_image === 't',
        is_video: record.is_video === 'true' || record.is_video === 't',
      })
      originalRecords.push(record)

      if (mediaToInsert.length >= batchSize) {
        await knex('product_media').insert(mediaToInsert)
        console.log(`Inserted ${mediaToInsert.length} product media records.`)

        mediaToInsert.length = 0
        originalRecords.length = 0
      }
    }

    if (mediaToInsert.length > 0) {
      await knex('product_media').insert(mediaToInsert)
      console.log(
        `Inserted ${mediaToInsert.length} remaining product media records.`,
      )
    }

    console.log('Product media import complete.')
  } finally {
    await knex.destroy()
  }
}

const tsvFilePath = process.argv[2]

if (!tsvFilePath) {
  console.error('Usage: tsx import-product-media.ts <path_to_tsv_file>')
  process.exit(1)
}

importProducts(tsvFilePath).catch((error) => {
  console.error('Error importing product media:', error)
  process.exit(1)
})
