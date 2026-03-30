export default function capitalSnakeCase(str: string): string {
  if (!str || typeof str !== 'string') {
    return ''
  }
  return str.toUpperCase().replace(/\s/g, '_')
}
