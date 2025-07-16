import fs from 'fs'
import { parse, format } from 'fast-csv'
import { knex } from '../db/index.js'

async function importProducts(filePath: string) {
  const productsToInsert: any[] = []
  const originalRecords: any[] = [] // To store original records for linking with IDs
  const batchSize = 1000

  const outputFilePath = 'product_ids.tsv'
  const csvStream = format({ headers: true, delimiter: '\t' })
  const writableStream = fs.createWriteStream(outputFilePath)
  csvStream.pipe(writableStream)

  // Write header for the output file
  csvStream.write({ product_id: 'product_id' })

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      headers: true,
      delimiter: '\t',
    }),
  )

  try {
    for await (const record of parser) {
      productsToInsert.push({
        title: record.title,
        description: knex.raw('ARRAY[?]::text[]', record.description),
        list_price: parseFloat(record.list_price),
        net_price: parseFloat(record.net_price),
        vendor_id: record.vendor_id,
        store_id: record.store_id,
        category_id: record.category_id,
        subcategory_id: record.subcategory_id,
        quantity_available: parseInt(record.quantity_available, 10),
      })
      originalRecords.push(record)

      if (productsToInsert.length >= batchSize) {
        const insertedIds = await knex('products')
          .insert(productsToInsert)
          .returning('product_id') // Assuming 'id' is the primary key
        console.log(`Inserted ${productsToInsert.length} products.`)

        insertedIds.forEach(({ product_id }: { product_id: number }) => {
          csvStream.write({
            product_id,
          })
        })

        productsToInsert.length = 0
        originalRecords.length = 0
      }
    }

    if (productsToInsert.length > 0) {
      const insertedIds = await knex('products')
        .insert(productsToInsert)
        .returning('product_id')
      console.log(`Inserted ${productsToInsert.length} remaining products.`)

      insertedIds.forEach(({ product_id }: { product_id: number }) => {
        csvStream.write({
          product_id,
        })
      })
    }

    console.log('Product import complete.')
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
