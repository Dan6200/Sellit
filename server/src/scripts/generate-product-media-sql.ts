import fs from 'fs'
import { parse } from 'fast-csv'

async function generateProductMediaSql(filePath: string) {
  const outputFilePath = 'product_media_insert.sql'
  const writableStream = fs.createWriteStream(outputFilePath)

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      headers: true,
      delimiter: '\t',
    }),
  )

  try {
    for await (const record of parser) {
      const productTitle = record.product_title.replace(/'/g, "''")
      const filename = record.filename.replace(/'/g, "''")
      const filepath = record.filepath.replace(/'/g, "''")
      const description = record.description
        ? record.description.replace(/'/g, "''")
        : ''
      const isDisplayImage =
        record.is_display_image === 'true' || record.is_display_image === 't'
          ? 'TRUE'
          : 'FALSE'
      const isLandingImage =
        record.is_landing_image === 'true' || record.is_landing_image === 't'
          ? 'TRUE'
          : 'FALSE'
      const filetype = record.filetype

      const insertStatement = `INSERT INTO product_media (product_id, filename, filepath, description, is_display_image, is_landing_image, is_video) VALUES ((SELECT product_id FROM products WHERE title = '${productTitle}'), '${filename}', '${filepath}', '${description}', ${isDisplayImage}, ${isLandingImage}, ${filetype});\n`
      writableStream.write(insertStatement)
    }

    console.log(
      `SQL INSERT statements for product media written to ${outputFilePath}`,
    )
  } finally {
    writableStream.end()
  }
}

const tsvFilePath = process.argv[2]

if (!tsvFilePath) {
  console.error('Usage: tsx generate-product-media-sql.ts <path_to_tsv_file>')
  process.exit(1)
}

generateProductMediaSql(tsvFilePath).catch((error) => {
  console.error('Error generating SQL for product media:', error)
  process.exit(1)
})
