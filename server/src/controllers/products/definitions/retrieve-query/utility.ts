export function handleSortQuery(queryString: string): string {
  let sortCriteria: string[] = queryString.split(',')
  let dbQueryString = 'ORDER BY '
  sortCriteria.forEach((str, index) => {
    if (index !== 0) dbQueryString += ', '
    if (str[0] === '-') {
      dbQueryString += str.slice(1) + ' DESC'
    } else {
      dbQueryString += str + ' ASC'
    }
  })
  return dbQueryString
}
