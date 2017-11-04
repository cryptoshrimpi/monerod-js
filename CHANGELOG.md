# Changelog

## 2.1.1

### `getTransactions()` supports `missed_tx` return value
- Add optional return attribute `missed_tx?: string[]`. If for one of the requested tx ids no information can be found the array contains the missed transactions ids.
- Return attribute `txs_as_hex` is optional.
- Return attribute `txs_as_json` is optional.
- Fix bug that leads to crash when no tx information can be found and parameter `decodeAsJson` is `true`
- Add unit test that expects `missed_tx`

### Updated dependencies
- @types/jasmine@2.6.2 
- @types/node@7.0.46 
- jasmine@2.8.0 