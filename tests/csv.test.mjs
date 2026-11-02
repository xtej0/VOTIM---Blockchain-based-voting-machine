import { test } from 'node:test'
import assert from 'node:assert/strict'
import { csvCell } from '../lib/csv.mjs'
test('CSV preserves commas and quotes', () => {
  assert.equal(csvCell('A,"B"'), '"A,""B"""')
})
test('CSV neutralizes formula prefixes', () => {
  for (const prefix of ['=', '+', '-', '@', '\t', '\r', '\n']) {
    assert.equal(csvCell(prefix + 'value'), '"' + "'" + prefix + 'value"')
  }
})
