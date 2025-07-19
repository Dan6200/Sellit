import fs from 'fs'
import { parse } from 'fast-csv'

async function importProducts(filePath: string) {
  const outputFilePath = 'products_insert.sql'
  const writableStream = fs.createWriteStream(outputFilePath)

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      headers: true,
      delimiter: '\t',
    }),
  )

  try {
    for await (const record of parser) {
      const product_id = record.product_id
      const title = record.title.replace(/'/g, "''")
      const description = JSON.stringify(JSON.parse(record.description))
        // Crucial to clean data
        .replace(/\\/g, '\\')
        .replace(/'/g, "''")
        .replace(/^\[/, '{')
        .replace(/\]$/, '}')
      const listPrice = parseFloat(record.list_price)
      const netPrice = parseFloat(record.net_price)
      const vendorId = record.vendor_id
      const storeId = record.store_id
      const categoryId = record.category_id
      const subcategoryId = record.subcategory_id
      const quantityAvailable = parseInt(record.quantity_available, 10)

      const insertStatement = `INSERT INTO products (product_id, title, description, list_price, net_price, vendor_id, store_id, category_id, subcategory_id, quantity_available) VALUES (${product_id}, '${title}', '${description}'::text[], ${listPrice}, ${netPrice}, '${vendorId}', ${storeId}, ${categoryId}, ${subcategoryId}, ${quantityAvailable});\n`
      writableStream.write(insertStatement)
    }

    console.log(`SQL INSERT statements written to ${outputFilePath}`)
  } finally {
    writableStream.end()
  }
}

const tsvFilePath = process.argv[2]

if (!tsvFilePath) {
  console.error('Usage: tsx generate-product-sql.ts <path_to_tsv_file>')
  process.exit(1)
}

importProducts(tsvFilePath).catch((error) => {
  console.error('Error generating SQL:', error)
  process.exit(1)
})
