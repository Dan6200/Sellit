export const getUserInformationAndRole = `
SELECT first_name, last_name, email, phone, country, dob,
			 CASE WHEN customer_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_customer,
			 CASE WHEN vendor_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_vendor
FROM users
LEFT JOIN customers
ON uid = customer_id
LEFT JOIN vendors
ON uid = vendor_id
WHERE uid = $1`
