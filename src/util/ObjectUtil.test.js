import * as ou from './ObjectUtil'

test('addFluentProperty: basics', () => {
  const o = ou.addFluentProperty({}, 'foo', 42)
  expect(o.foo()).toEqual(42)
  o.foo(43).foo(44)
  expect(o.foo()).toEqual(44)
})

test('addFluentProperty: empty name', () => {
  const o = ou.addFluentProperty({}, '', 42)
  expect(o['']()).toEqual(42)
  o[''](43)
  expect(o['']()).toEqual(43)
})

test('addFluentArray: basics', () => {

  const o = ou.addFluentArray({}, 'foo')
  expect(o.foos()).toEqual([])
  expect(o.foosLength()).toEqual(0)

  expect(o.appendFoo('a')).toEqual('a')
  expect(o.foos()).toEqual(['a'])

  expect(o.appendFoo('b')).toEqual('b')
  expect(o.foos()).toEqual(['a','b'])
  expect(o.foo(0)).toEqual('a')
  expect(o.foo(1)).toEqual('b')
  expect(o.foosLength()).toEqual(2)
})

test('addFluentArray: empty name', () => {

  const o = ou.addFluentArray({}, '')
  expect(o.items()).toEqual([])
  expect(o.length()).toEqual(0)

  expect(o.append('a')).toEqual('a')
  expect(o.items()).toEqual(['a'])

  expect(o.append('b')).toEqual('b')
  expect(o.items()).toEqual(['a','b'])
  expect(o.item(0)).toEqual('a')
  expect(o.item(1)).toEqual('b')
  expect(o.length()).toEqual(2)
})

test('max', () => {

  expect(
    ou.max([5,4,1,2,3], x => x*x, x => x%2 == 0)
  )
  .toEqual(16)

  expect(
    ou.max([5,4,1,2,3], x => x*x)
  )
  .toEqual(25)

  expect(
    ou.max([5,4,1,2,3], x => x*x, x => x < 0)
  )
  .toEqual(Number.NEGATIVE_INFINITY)
})

test('min', () => {

    expect(
      ou.min([5,4,1,2,3], x => x*x, x => x%2 == 0)
    )
    .toEqual(4)

    expect(
      ou.min([5,4,1,2,3], x => x*x)
    )
    .toEqual(1)

    expect(
      ou.min([5,4,1,2,3], x => x*x, x => x < 0)
    )
    .toEqual(Number.POSITIVE_INFINITY)
})

test('minMax', () => {

    expect(
      ou.minMax([5,4,1,2,3], x => x*x, x => x%2 == 0)
    )
    .toEqual([4, 16])
})

test('toString', () => {
  expect(ou.toString({})).toEqual('')
  expect(ou.toString({foo:'bar', baz:42})).toEqual('foo:bar, baz:42')
  expect(ou.toString(null)).toEqual('')
  expect(ou.toString({foo:{baz:42}})).toEqual('foo:[object Object]')
})
