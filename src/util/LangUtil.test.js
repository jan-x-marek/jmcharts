import {isNullOrNaN, minmax} from './LangUtil';

test('isNanOrNull', () => {
  expect(isNullOrNaN(1)).toEqual(false)
  expect(isNullOrNaN(NaN)).toEqual(true)
  expect(isNullOrNaN("foo")).toEqual(true)
  expect(isNullOrNaN(null)).toEqual(true)
  expect(isNullOrNaN(undefined)).toEqual(true)
})

test('minmax', () => {
  expect(minmax(1,3,0)).toEqual(1)
  expect(minmax(1,3,1)).toEqual(1)
  expect(minmax(1,3,2)).toEqual(2)
  expect(minmax(1,3,3)).toEqual(3)
  expect(minmax(1,3,4)).toEqual(3)
})
