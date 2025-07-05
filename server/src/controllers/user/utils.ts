export const getUserInformationAndRole = `
SELECT first_name, last_name, email, phone, country, dob,
			 CASE WHEN customer_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_customer,
			 CASE WHEN vendor_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_vendor
FROM users
LEFT JOIN customers
ON user_id = customer_id
LEFT JOIN vendors
ON user_id = vendor_id
WHERE user_id = $1`
