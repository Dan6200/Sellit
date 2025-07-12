// Wraps the function argument.
// It logs the error with a timestamp and context, then rethrows the error
export default async function <T>(
	promise: Promise<T>,
	context: string
): Promise<T> {
	try {
		return await promise
	} catch (reason) {
		// logs the error to the console with a timestamp and context
		console.error(`[${new Date().toISOString()}]\n[${context}]\n`, reason)
		throw reason
	}
}
