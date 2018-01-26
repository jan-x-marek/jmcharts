
import * as _ from 'underscore'

import * as lu from './LangUtil'
import * as au from './ArrayUtil'
import * as ou from './ObjectUtil'

export class Series {

  constructor(domain, range, domainComparator = au.numberComparator, defaultValue = 0) {

    if (domain.length !== range.length) {
      throw Error(`Same length expected: ${domain.length} ${range.length}`)
    }

    //TODO check that the domain is in ascending order and unique

    this._domain = domain
    this._range = range
    this.domainComparator = domainComparator
    this.defaultValue = defaultValue

    ou.addFluentProperty(this, 'name', '')
  }

  length() {
    return this._domain.length
  }

  isEmpty() {
    return this.length() === 0
  }

  domain(i) {
    return this._domain[i]
  }

  range(i) {
    return this._range[i]
  }

  indexLE(d) {
    if (d === null || d === undefined || isNaN(d)) {
      return -1
    } else {
      return au.binarySearchLE(this._domain, d, this.domainComparator)
    }
  }

  indexGE(d) {
    if (d === null || d === undefined || isNaN(d)) {
      return -1
    } else {
      return au.binarySearchGE(this._domain, d, this.domainComparator)
    }
  }

  apply(d) {
    const i = this.indexLE(d)
    return i < 0 ? this.defaultValue : this.range(i)
  }

  mapRange(f, defaultValue=0) {
    return new Series(this._domain, this._range.map(f), this.domainComparator, defaultValue)
  }
}

export class ZoomableSlice {

  constructor(series) {
    this.series = series
    this.start = this.domainStart()
    this.end = this.domainEnd()
    this._update()
  }

  _update() {
    this.startIndex = this.series.indexGE(this.start)
    this.endIndex = this.series.indexLE(this.end)
    if (this.startIndex < 0 || this.endIndex < 0) {
      this.len = 0
    } else {
      this.len = this.endIndex - this.startIndex + 1
    }
  }

  name() {
    return this.series.name()
  }

  sliceStart() {
    return this.start
  }

  sliceEnd() {
    return this.end
  }

  domainStart() {
    return this.series.domain(0)
  }

  domainEnd() {
    return this.series.domain(this.series.length() - 1)
  }

  length() {
    return this.len
  }

  isEmpty() {
    return this.length() === 0
  }

  domain(i) {
    return this.series.domain(this.startIndex + i)
  }

  range(i) {
    return this.series.range(this.startIndex + i)
  }

  indexLE(d) {
    const i = this.series.indexLE(d) - this.startIndex
    return i < 0 ? -1 : i
  }

  indexGE(d) {
    const i = this.series.indexGE(d)
    if (i < 0) {
      return i
    }
    else if (i < this.startIndex) {
      return 0
    }
    else if (i > this.endIndex) {
      return -1
    }
    else {
      return i - this.startIndex
    }
  }

  apply(d) {
    const i = this.indexLE(d)
    return i < 0 ? this.series.defaultValue : this.range(i)
  }

  mapRange(f, defaultValue=0) {
    const result = new ZoomableSlice(this.series.mapRange(f, defaultValue))
    result.gotoIndex(this.startIndex, this.endIndex)
    return result
  }

  gotoDomain(start, end) {

    if (lu.isNullOrNaN(start) || lu.isNullOrNaN(end)) {
      return false
    }

    if (start > end) {
      return false
    }

    const [prevStart, prevEnd] = [this.start, this.end]
    this.start = Math.max(this.domainStart(), start)
    this.end = Math.min(this.domainEnd(), end)
    this._update()

    if (prevStart === undefined || isNaN(prevStart)) {
      return false
    } else {
      return prevStart !== this.start || prevEnd !== this.end
    }
  }

  gotoIndex(start, end) {
    start = Math.max(0, start)
    end = Math.min(this.series.length() - 1, end)
    return this.gotoDomain(this.series.domain(start), this.series.domain(end))
  }

  gotoRelStart(relStart) {
    if (relStart < 0 || relStart > 1) {
      throw Error(`${relStart}`)
    }
    const domainSize = this.domainEnd() - this.domainStart()
    const newStart = this.domainStart() + domainSize * relStart
    const windowSize = this.end - this.start
    const newEnd = newStart + windowSize
    if (newEnd > this.domainEnd()) {
      return this.gotoDomain(this.domainEnd() - windowSize, this.domainEnd())
    } else {
      return this.gotoDomain(newStart, newEnd)
    }
  }

  gotoEnd(size) {
    const end = this.series.length() - 1
    const start = end - size + 1
    return this.gotoIndex(start, end)
  }

  zoom(zoom) {
    if (zoom <= 0 ) {
      throw Error(`${zoom} <= 0`)
    }
    const diameter = this.end - this.start
    const center = (this.end + this.start) / 2
    const newDiameter = diameter * zoom
    const newEnd = Math.min(center + newDiameter/2, this.domainEnd())
    const newStart = Math.max(newEnd - newDiameter, this.domainStart())
    return this.gotoDomain(newStart, newEnd)
  }

  scroll(relativeShift) {
    const diameter = this.end - this.start
    const requestedShift = diameter * relativeShift
    const newEnd = Math.min(
      Math.max(this.end + requestedShift, this.domainStart() + diameter),
      this.domainEnd())
    const newStart = Math.max(newEnd - diameter, this.domainStart())
    return this.gotoDomain(newStart, newEnd)
  }

  getVisibleDataWindow() {
    if (this.series.isEmpty()) {
      return [0, 1]
    }
    const fullWidth = this.domainEnd() - this.domainStart()
    const visibleWidth = this.sliceEnd() - this.sliceStart()
    const relVisibleWidth = visibleWidth / fullWidth
    const relStart = (this.sliceStart() - this.domainStart()) / fullWidth
    return [relStart, relVisibleWidth]
  }
}

export function min(series, f=identity) {
  let min = Number.POSITIVE_INFINITY
  for(let i=0; i<series.length(); i++) {
    const x = f(series.range(i))
    if (x < min) {
      min = x
    }
  }
  return min
}

export function max(series, f=identity) {
  let max = Number.NEGATIVE_INFINITY
  for(let i=0; i<series.length(); i++) {
    const x = f(series.range(i))
    if (x > max) {
      max = x
    }
  }
  return max
}

function identity(x) {
  return x
}

export function ohlcSeries(date, open, high, low, close, domainComparator = au.numberComparator) {
  return new Series(date, _.zip(open, high, low, close), domainComparator)
}

export function getClosestIndex(series, x) {
  if (series.isEmpty()) {
    return -1
  }
  const indexLE = series.indexLE(x)
  const indexGE = series.indexGE(x)
  if (indexLE < 0) {
    return indexGE
  }
  if (indexGE < 0) {
    return indexLE
  }
  const valueLE = series.domain(indexLE)
  const valueGE = series.domain(indexGE)
  if (x-valueLE < valueGE-x) {
    return indexLE
  } else {
    return indexGE
  }
}

//Returns median distance between the domain points of the series.
export function getTimeFrame(s) {
  const gaps = []
  const start = s.length() - 1
  const end = Math.max(0, s.length() - 20)
  for(let i = start; i > end; i--) {
    const gap = s.domain(i) - s.domain(i-1)
    gaps.push(gap)
  }
  gaps.sort()
  if (gaps.lenght === 0) {
    return Number.NaN
  } else {
    return gaps[Math.floor(gaps.length/2)]
  }
}

export function series(domain, range, domainComparator = au.numberComparator, defaultValue = 0) {
  return new Series(domain, range, domainComparator, defaultValue)
}

export const exports = {
  Series: Series,
  ZoomableSlice: ZoomableSlice,
  min: min,
  max: max,
  identity: identity,
  ohlcSeries: ohlcSeries,
  getClosestIndex: getClosestIndex,
  getTimeFrame: getTimeFrame,
  series: series,
}
