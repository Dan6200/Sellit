

import re
import os
import json

def sanitize_filename(title):
    # Remove apostrophes, commas, and other non-valid characters
    title = re.sub(r"['\",]", "", title)
    # Replace spaces with underscores
    title = re.sub(r"\s+", "_", title)
    return title

def create_image_json(products):
    output_dir = '.'
    os.makedirs(output_dir, exist_ok=True)

    image_data = []
    for product in products:
        title = product['title']
        description = product['description']
        
        filename = sanitize_filename(title) + ".jpg"
        
        image_data.append({
            "title": title,
            "description": description,
            "filename": os.path.join(output_dir, filename)
        })
    
    with open('images.json', 'w') as f:
        json.dump(image_data, f, indent=4)
    print("Image JSON file created: images.json")

# Read the SQL file
with open('supabase/seed.sql', 'r') as f:
    sql_content = f.read()

# Find the product insertion block
product_insert_block_match = re.search(r"insert into products .*?values\s*([\s\S]*?);", sql_content, re.IGNORECASE)

products = []
if product_insert_block_match:
    product_values_str = product_insert_block_match.group(1)
    
    # Regex to find all product entries within the block
    product_regex = re.compile(r"('((?:[^']|'')*)',\s*'((?:[^']|'')*)',)")
    
    matches = product_regex.finditer(product_values_str)
    
    for match in matches:
        # Handle escaped single quotes
        title = match.group(2).replace("''", "'")
        description = match.group(3).replace("''", "'")
        products.append({'title': title, 'description': description})

# Process all products
create_image_json(products)

