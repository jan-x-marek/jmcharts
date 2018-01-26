import * as au from './ArrayUtil'

test('binarySearch: odd size', () => {
  const a = [1,5,6,7,10]
  expect(au.binarySearch(a, 0)).toEqual(-1)
  expect(au.binarySearch(a, 1)).toEqual(0)
  expect(au.binarySearch(a, 2)).toEqual(-2)
  expect(au.binarySearch(a, 3)).toEqual(-2)
  expect(au.binarySearch(a, 5)).toEqual(1)
  expect(au.binarySearch(a, 6)).toEqual(2)
  expect(au.binarySearch(a, 7)).toEqual(3)
  expect(au.binarySearch(a, 8)).toEqual(-5)
  expect(au.binarySearch(a, 10)).toEqual(4)
  expect(au.binarySearch(a, 11)).toEqual(-6)
})

test('binarySearch: even size', () => {
  const a = [1,5,6,10]
  expect(au.binarySearch(a, 0)).toEqual(-1)
  expect(au.binarySearch(a, 1)).toEqual(0)
  expect(au.binarySearch(a, 2)).toEqual(-2)
  expect(au.binarySearch(a, 3)).toEqual(-2)
  expect(au.binarySearch(a, 5)).toEqual(1)
  expect(au.binarySearch(a, 6)).toEqual(2)
  expect(au.binarySearch(a, 8)).toEqual(-4)
  expect(au.binarySearch(a, 10)).toEqual(3)
  expect(au.binarySearch(a, 11)).toEqual(-5)
})

test('binarySearch: custom comparator', () => {
  const a = [
    {'key':1, 'value':'foo'},
    {'key':5, 'value':'bar'},
    {'key':10}]
  const comparator = (x,y) => au.numberComparator(x.key, y.key)
  expect(au.binarySearch(a, {'key':0}, comparator)).toEqual(-1)
  expect(au.binarySearch(a, {'key':1}, comparator)).toEqual(0)
  expect(au.binarySearch(a, {'key':2}, comparator)).toEqual(-2)
  expect(au.binarySearch(a, {'key':5}, comparator)).toEqual(1)
  expect(au.binarySearch(a, {'key':6}, comparator)).toEqual(-3)
  expect(au.binarySearch(a, {'key':10}, comparator)).toEqual(2)
  expect(au.binarySearch(a, {'key':11}, comparator)).toEqual(-4)
})

test('binarySearch: empty', () => {
  const a = []
  expect(au.binarySearch(a, 0)).toEqual(-1)
})


test('binarySearchLE: default comparator', () => {
  const a = [1,5,6,10]
  expect(au.binarySearchLE(a, 0)).toEqual(-1)
  expect(au.binarySearchLE(a, 1)).toEqual(0)
  expect(au.binarySearchLE(a, 2)).toEqual(0)
  expect(au.binarySearchLE(a, 5)).toEqual(1)
  expect(au.binarySearchLE(a, 6)).toEqual(2)
  expect(au.binarySearchLE(a, 8)).toEqual(2)
  expect(au.binarySearchLE(a, 10)).toEqual(3)
  expect(au.binarySearchLE(a, 11)).toEqual(3)
})

test('binarySearchLE: custom comparator', () => {
  const a = [
    {'key':1, 'value':'foo'},
    {'key':5, 'value':'bar'},
    {'key':10}]
  const comparator = (x,y) => au.numberComparator(x.key, y.key)
  expect(au.binarySearchLE(a, {'key':0}, comparator)).toEqual(-1)
  expect(au.binarySearchLE(a, {'key':1}, comparator)).toEqual(0)
  expect(au.binarySearchLE(a, {'key':2}, comparator)).toEqual(0)
  expect(au.binarySearchLE(a, {'key':5}, comparator)).toEqual(1)
  expect(au.binarySearchLE(a, {'key':6}, comparator)).toEqual(1)
  expect(au.binarySearchLE(a, {'key':10}, comparator)).toEqual(2)
  expect(au.binarySearchLE(a, {'key':11}, comparator)).toEqual(2)
})

test('binarySearchGE: default comparator', () => {
  const a = [1,5,6,10]
  expect(au.binarySearchGE(a, 0)).toEqual(0)
  expect(au.binarySearchGE(a, 1)).toEqual(0)
  expect(au.binarySearchGE(a, 2)).toEqual(1)
  expect(au.binarySearchGE(a, 5)).toEqual(1)
  expect(au.binarySearchGE(a, 6)).toEqual(2)
  expect(au.binarySearchGE(a, 8)).toEqual(3)
  expect(au.binarySearchGE(a, 10)).toEqual(3)
  expect(au.binarySearchGE(a, 11)).toEqual(-1)
})

test('isArray', () => {
  expect(au.isArray([])).toEqual(true)
  expect(au.isArray([1,2,3])).toEqual(true)
  expect(au.isArray(1)).toEqual(false)
  expect(au.isArray('xxx')).toEqual(false)
  expect(au.isArray({'x':'y'})).toEqual(false)
  expect(au.isArray(null)).toEqual(false)
  expect(au.isArray(undefined)).toEqual(false)
  expect(au.isArray(NaN)).toEqual(false)
})

test('concatValues', () => {
  const o1 = {'a':1, 'b':[2,3], 'c':4}
  const o2 = {'b':11, 'c':[12,13], 'd':14}
  const o = au.concatValues(o1, o2)
  expect(JSON.stringify(o)).toEqual('{"a":[1],"b":[2,3,11],"c":[4,12,13],"d":[14]}')
})

test('concatValues - not an object', () => {
  expect(JSON.stringify(au.concatValues(null, null))).toEqual('{}')
  expect(JSON.stringify(au.concatValues({'a':1}, null))).toEqual('{"a":[1]}')
  expect(JSON.stringify(au.concatValues(null, {'a':1}))).toEqual('{"a":[1]}')
  expect(JSON.stringify(au.concatValues({'a':1}, undefined))).toEqual('{"a":[1]}')
  expect(JSON.stringify(au.concatValues(undefined, {'a':1}))).toEqual('{"a":[1]}')
  expect(JSON.stringify(au.concatValues({'a':1}, 0))).toEqual('{"a":[1]}')
  expect(JSON.stringify(au.concatValues(0, {'a':1}))).toEqual('{"a":[1]}')
})
