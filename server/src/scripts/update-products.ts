import fs from 'fs'
import { parse, format } from 'fast-csv'
import { knex } from '../db/index.js'

async function importProducts(filePath: string) {
  const csvStream = format({ headers: true, delimiter: '\t' })

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      headers: true,
      delimiter: '\t',
    }),
  )

  try {
    for await (const record of parser) {
      const description = JSON.parse(record.description as string)
      await knex('products')
        .update({ description })
        .where('product_id', record.product_id)
    }
    console.log('Product update complete.')
  } finally {
    csvStream.end()
    await knex.destroy()
  }
}

const tsvFilePath = process.argv[2]

if (!tsvFilePath) {
  console.error('Usage: tsx import-products.ts <path_to_tsv_file>')
  process.exit(1)
}

importProducts(tsvFilePath).catch((error) => {
  console.error('Error importing products:', error)
  process.exit(1)
})
