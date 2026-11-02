export function csvCell(value) {
  const text = String(value)
  const safe = /^[=+@\-\t\r\n]/.test(text) ? "'" + text : text
  return '"' + safe.replaceAll('"', '""') + '"'
}
