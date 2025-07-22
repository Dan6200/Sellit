    SELECT p.*, 
        (SELECT JSON_AGG(pm.*) FROM product_media pm WHERE pm.product_id=p.product_id) AS media,
        c.category_name, 
        s.subcategory_name,
        AVG(pr.rating) AS average_rating,
        COUNT(pr.rating) AS review_count,
        COUNT(oi.order_item_id) AS products_sold
    FROM products p
    JOIN categories c USING (category_id)
    JOIN subcategories s USING (subcategory_id)
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN product_reviews pr ON oi.order_item_id = pr.order_item_id
    JOIN stores st ON p.store_id = st.store_id
    WHERE p.product_id=1119 
    AND p.vendor_id='14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' 
    AND st.vendor_id='14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99'
    GROUP BY 
        p.product_id, c.category_name, s.subcategory_name;
