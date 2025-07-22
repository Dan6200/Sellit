--SELECT JSON_AGG(product_data) AS products, COUNT(product_data) AS total_products FROM
-- SELECT product.*,
-- SELECT JSON_AGG(media_data) FROM
--  (SELECT pm.filename,
--	 CASE WHEN pdi.filename IS NOT NULL 
--	  THEN TRUE ELSE FALSE END AS is_display_image,
--	   filepath, description FROM
--		  product_media pm
--			 LEFT JOIN product_display_image pdi
--		   USING (filename)
--		  WHERE
--		 pm.product_id=products.product_id)
--		AS media_data)
--	 AS media)
--	 AS product_data
--	FROM products;

-- SELECT JSON_AGG(product_data) AS products,
--  COUNT(product_data) AS total_products FROM
-- 	(SELECT p.*, 
-- 		(SELECT JSON_AGG(media_data) FROM
-- 			(SELECT pm.filename,
-- 				 CASE WHEN pdi.filename IS NOT NULL
-- 					THEN TRUE ELSE FALSE END AS is_display_image,
-- 					 filepath, description FROM
-- 						product_media pm
-- 						LEFT JOIN product_display_image pdi
-- 						USING (filename)
-- 						WHERE pm.product_id=p.product_id)
-- 					AS media_data) 
-- 				AS media FROM products p
-- 			WHERE p.product_id=173)
-- 		AS product_data;

--			SELECT p.*, 
--				(SELECT JSON_AGG(media) FROM 
--					(SELECT pm.filename, 
--					 CASE WHEN pdi.filename IS NOT NULL 
--					  THEN true ELSE false END
--					   AS is_display_image,
--							filepath, description FROM 
--							 product_media pm
--							  LEFT JOIN product_display_image pdi
--							 USING (filename)
--							WHERE pm.product_id=p.product_id)
--						AS media) 
--					AS media 
--				FROM products p
--			WHERE p.product_id=173;

-- SELECT JSON_AGG(product_data) AS products,
--  COUNT(product_data) AS total_products FROM
-- 	(SELECT p.*, 
-- 		(SELECT JSON_AGG(media_data) FROM
-- 			(SELECT pm.filename,
-- 				 CASE WHEN pdi.filename IS NOT NULL
-- 					THEN TRUE ELSE FALSE END AS is_display_image,
-- 					 filepath, description FROM
-- 						product_media pm
-- 						LEFT JOIN product_display_image pdi
-- 						USING (filename)
-- 						WHERE
-- 						pm.product_id=p.product_id)
-- 					AS media_data) 
-- 				AS media FROM products p)
-- 			AS product_data
-- 		WHERE store_id=57;

-- WITH product_data AS (
-- 	SELECT p.*, 
-- 		(SELECT JSON_AGG(media_data) FROM
-- 			(SELECT pm.filename,
-- 				 CASE WHEN pdi.filename IS NOT NULL
-- 					THEN TRUE ELSE FALSE END AS is_display_image,
-- 					 filepath, description FROM
-- 						product_media pm
-- 						 LEFT JOIN product_display_image pdi
-- 							USING (filename)
-- 						 WHERE
-- 						pm.product_id=p.product_id)
-- 					AS media_data) 
-- 					AS media, c.category_name AS category, c.subcategories->>(p.product_id::text) AS subcategory
-- 				FROM products p
-- 				JOIN product_categories pc ON p.product_id = pc.product_id 
-- 				JOIN categories c ON pc.category_id=c.category_id
-- 				WHERE store_id=199
-- 			 ORDER BY created_at DESC LIMIT 100)
-- SELECT JSON_AGG(product_data) AS products, (SELECT COUNT(*) FROM products WHERE store_id=199) AS total_products FROM product_data;
--
-- WITH product_data AS (
-- 	 SELECT p.*,
-- 		(SELECT JSON_AGG(media_data) FROM
-- 			(SELECT pm.*
-- 					 FROM product_media pm
-- 					 WHERE pm.product_id=p.product_id)
-- 					AS media_data)
-- 					 AS media, c.category_name, s.subcategory_name,
-- 					(SELECT JSON_BUILD_OBJECT(
-- 								'average_rating',
-- 								AVG(pr.rating),
-- 								'review_count',
-- 								COUNT(pr.rating))
-- 						 FROM product_reviews pr 
-- 						 JOIN order_items oi 
-- 						 ON pr.order_item_id = oi.order_item_id 
-- 						 WHERE oi.product_id = p.product_id) 
-- 					AS average_rating
-- 				FROM products p
-- 				JOIN categories c USING (category_id)
-- 				JOIN subcategories s USING (subcategory_id)
--
-- SELECT JSON_AGG(product_data) AS products,
	-- (SELECT COUNT(*) FROM product_data) AS total_products FROM product_data;

    SELECT p.*, 
		(SELECT JSON_AGG(media_data) FROM
			(SELECT pm.*
					 FROM product_media pm 
					 WHERE pm.product_id=p.product_id)
					AS media_data) 
					AS media, c.category_name, s.subcategory_name,
				AVG(pr.rating) AS average_rating,
				COUNT(pr.rating) AS review_count,
				COUNT(oi.order_item_id) AS products_sold
			FROM products p
			JOIN categories c USING (category_id)
			JOIN subcategories s USING (subcategory_id)
			LEFT JOIN order_items oi ON p.product_id = oi.product_id
			LEFT JOIN product_reviews pr ON oi.order_item_id = pr.order_item_id
			GROUP BY 
				p.product_id, p.title, p.description, p.list_price, p.net_price, p.quantity_available, p.created_at, p.updated_at, p.store_id, p.category_id, p.subcategory_id,
				c.category_name, s.subcategory_name
  WHERE p.product_id=1119 
    AND p.vendor_id='14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' AND p.store_id=(select store_id from stores where vendor_id='14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99');
