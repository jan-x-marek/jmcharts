import * as sr from './Series'

test('series - basics', () => {

  const s = new sr.Series([1,3,5], [11,13,15])

  expect(s.length()).toEqual(3)

  expect(s.domain(0)).toEqual(1)
  expect(s.domain(2)).toEqual(5)

  expect(s.range(0)).toEqual(11)
  expect(s.range(2)).toEqual(15)

  expect(s.indexLE(0)).toEqual(-1)
  expect(s.indexLE(1)).toEqual(0)
  expect(s.indexLE(2)).toEqual(0)
  expect(s.indexLE(5)).toEqual(2)
  expect(s.indexLE(6)).toEqual(2)

  expect(s.indexLE(null)).toEqual(-1)
  expect(s.indexLE(undefined)).toEqual(-1)
  expect(s.indexLE(NaN)).toEqual(-1)

  expect(s.indexGE(0)).toEqual(0)
  expect(s.indexGE(1)).toEqual(0)
  expect(s.indexGE(2)).toEqual(1)
  expect(s.indexGE(5)).toEqual(2)
  expect(s.indexGE(6)).toEqual(-1)

  expect(s.indexGE(null)).toEqual(-1)
  expect(s.indexGE(undefined)).toEqual(-1)
  expect(s.indexGE(NaN)).toEqual(-1)

  expect(s.apply(0)).toEqual(0)
  expect(s.apply(1)).toEqual(11)
  expect(s.apply(2)).toEqual(11)
  expect(s.apply(5)).toEqual(15)
  expect(s.apply(6)).toEqual(15)
})

test('series - map range', () => {
  const s = new sr.Series([1,3,5], [11,13,15])
  const sm = s.mapRange(x => x*2)
  expect(sm._domain).toEqual([1,3,5])
  expect(sm._range).toEqual([22,26,30])
})

test('series - empty', () => {

  const s = new sr.Series([], [])
  expect(s.length()).toEqual(0)
  expect(s.domain(0)).toEqual(undefined)
  expect(s.range(0)).toEqual(undefined)
  expect(s.indexLE(0)).toEqual(-1)
  expect(s.indexGE(0)).toEqual(-1)
  expect(s.apply(0)).toEqual(0)

  const sm = s.mapRange(x => x*2)
  expect(sm.length()).toEqual(0)
  expect(sm.domain(0)).toEqual(undefined)
  expect(sm.range(0)).toEqual(undefined)
  expect(sm.indexLE(0)).toEqual(-1)
  expect(sm.indexGE(0)).toEqual(-1)
  expect(sm.apply(0)).toEqual(0)
})

test('zoomable slice - basics', () => {

  const s = new sr.Series([1,3,5,6,7,8], [11,13,15,16,17,18])
  const zs = new sr.ZoomableSlice(s)

  expect(zs.length()).toEqual(6)
  expect(zs.domain(0)).toEqual(1)
  expect(zs.domain(5)).toEqual(8)

  let changed = zs.gotoEnd(3)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(6)
  expect(zs.end).toEqual(8)
  expect(zs.startIndex).toEqual(3)
  expect(zs.endIndex).toEqual(5)

  expect(zs.length()).toEqual(3)

  expect(zs.domain(0)).toEqual(6)
  expect(zs.domain(2)).toEqual(8)

  expect(zs.range(0)).toEqual(16)
  expect(zs.range(2)).toEqual(18)

  expect(zs.indexLE(5)).toEqual(-1)
  expect(zs.indexLE(6)).toEqual(0)
  expect(zs.indexLE(8)).toEqual(2)
  expect(zs.indexLE(9)).toEqual(2)

  expect(s.indexLE(null)).toEqual(-1)
  expect(s.indexLE(undefined)).toEqual(-1)
  expect(s.indexLE(NaN)).toEqual(-1)

  expect(zs.indexGE(5)).toEqual(0)
  expect(zs.indexGE(6)).toEqual(0)
  expect(zs.indexGE(8)).toEqual(2)
  expect(zs.indexGE(9)).toEqual(-1)

  expect(s.indexGE(null)).toEqual(-1)
  expect(s.indexGE(undefined)).toEqual(-1)
  expect(s.indexGE(NaN)).toEqual(-1)

  expect(zs.apply(5)).toEqual(0)
  expect(zs.apply(6)).toEqual(16)
  expect(zs.apply(8)).toEqual(18)
  expect(zs.apply(9)).toEqual(18)

  changed = zs.gotoEnd(3)
  expect(changed).toEqual(false)
})

test('zoomable slice - map range', () => {

  const s = new sr.Series([1,3,5,6,7,8], [11,13,15,16,17,18])
  const zs = new sr.ZoomableSlice(s)
  zs.gotoEnd(3)

  const zsm = zs.mapRange(x => x*2)

  expect(zsm.series._domain).toEqual([1,3,5,6,7,8])
  expect(zsm.series._range).toEqual([22,26,30,32,34,36])
  expect(zsm.startIndex).toEqual(3)
  expect(zsm.endIndex).toEqual(5)
})

test('zoomable slice - zoom', () => {

  const s = new sr.Series([10,12,14,17,24,29,35], [1,2,3,4,5,6,7])
  const zs = new sr.ZoomableSlice(s)

  zs.gotoIndex(2, 4)
  expect(zs.start).toEqual(14)
  expect(zs.end).toEqual(24)
  expect(zs.startIndex).toEqual(2)
  expect(zs.endIndex).toEqual(4)

  let changed = zs.zoom(1.5)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(11.5)
  expect(zs.end).toEqual(26.5)
  expect(zs.startIndex).toEqual(1)
  expect(zs.endIndex).toEqual(4)

  changed = zs.zoom(1.5)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(10)
  expect(zs.end).toEqual(30.25)
  expect(zs.startIndex).toEqual(0)
  expect(zs.endIndex).toEqual(5)

  changed = zs.zoom(1.5)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(10)
  expect(zs.end).toEqual(35)
  expect(zs.startIndex).toEqual(0)
  expect(zs.endIndex).toEqual(6)

  changed = zs.zoom(1.5)
  expect(changed).toEqual(false)

  changed = zs.zoom(0.5)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(16.25)
  expect(zs.end).toEqual(28.75)
  expect(zs.startIndex).toEqual(3)
  expect(zs.endIndex).toEqual(4)
})

test('zoomable slice - scroll', () => {

  const s = new sr.Series([10,12,14,17,24,29,35], [1,2,3,4,5,6,7])
  const zs = new sr.ZoomableSlice(s)

  zs.gotoIndex(2, 4)
  expect(zs.start).toEqual(14)
  expect(zs.end).toEqual(24)
  expect(zs.startIndex).toEqual(2)
  expect(zs.endIndex).toEqual(4)

  let changed = zs.scroll(0.5)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(19)
  expect(zs.end).toEqual(29)
  expect(zs.startIndex).toEqual(4)
  expect(zs.endIndex).toEqual(5)

  changed = zs.scroll(-0.5)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(14)
  expect(zs.end).toEqual(24)
  expect(zs.startIndex).toEqual(2)
  expect(zs.endIndex).toEqual(4)

  changed = zs.scroll(0)
  expect(changed).toEqual(false)

  changed = zs.scroll(10)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(25)
  expect(zs.end).toEqual(35)
  expect(zs.startIndex).toEqual(5)
  expect(zs.endIndex).toEqual(6)

  changed = zs.scroll(-10)
  expect(changed).toEqual(true)
  expect(zs.start).toEqual(10)
  expect(zs.end).toEqual(20)
  expect(zs.startIndex).toEqual(0)
  expect(zs.endIndex).toEqual(3)
})

test('zoomable slice - empty', () => {

  const s = new sr.Series([], [])
  const zs = new sr.ZoomableSlice(s)

  expect(zs.length()).toEqual(0)
  expect(zs.domain(0)).toEqual(undefined)

  let changed = zs.gotoEnd(3)
  expect(changed).toEqual(false)
  expect(zs.length()).toEqual(0)
  expect(zs.domain(0)).toEqual(undefined)

  changed = zs.zoom(0.5)
  expect(changed).toEqual(false)
  expect(zs.length()).toEqual(0)
  expect(zs.domain(0)).toEqual(undefined)

  changed = zs.zoom(1.5)
  expect(changed).toEqual(false)
  expect(zs.length()).toEqual(0)
  expect(zs.domain(0)).toEqual(undefined)

  changed = zs.zoom(1.5)
  expect(changed).toEqual(false)
  expect(zs.length()).toEqual(0)
  expect(zs.domain(0)).toEqual(undefined)
})
