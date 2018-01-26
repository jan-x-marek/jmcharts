import {jmcharts as c} from '../../src/index'

const timeUnit = 60000 // 1 minute
const priceUnit = 1

export function generateOHLCV(size) {

  const endTime = Math.floor(new Date().getTime() / timeUnit) * timeUnit
  const startTime =  endTime - timeUnit*(size-1)

  const times = new Array(size)
  const opens = new Array(size)
  const highs = new Array(size)
  const lows = new Array(size)
  const closes = new Array(size)
  const vols = new Array(size)

  let lastClose = 10000

  for(let i=0; i<size; i++) {

    const open = lastClose + randomPriceDelta(3)
    const close = open + randomPriceDelta(10)
    const high = Math.max(open, close) + Math.abs(randomPriceDelta(5))
    const low = Math.min(open, close) - Math.abs(randomPriceDelta(5))

    times[i] = startTime + i * timeUnit
    opens[i] = open
    highs[i] = high
    lows[i] = low
    closes[i] = close
    vols[i] = randomVolume()

    lastClose = close
  }

  return {time: times, open: opens, high: highs, low: lows, close: closes, vol: vols}
}

function randomPriceDelta(size) {
  const r = Math.random()
  return Math.round((r - 0.5) * size) * priceUnit
}

function randomVolume() {
  const r = Math.random()
  return 100 + r * 200
}

export function movingAverage(series, period) {
  let sum = 0
  let i = 0
  let ma = 0
  return series.mapRange(x => {
    if (i < period) {
      sum += x
      ma = sum / (i+1)
    } else {
      ma = ma - series.range(i-period)/period + series.range(i)/period
    }
    i++
    return ma
  })
}

export function crossingUp(series1, series2, targetValues) {
  const dates = []
  const values = []
  for(let i=1; i<series1.length(); i++) {
    if (series1.range(i-1) <= series2.range(i-1) && series1.range(i) > series2.range(i)) {
      dates.push(series1.domain(i))
      values.push(targetValues[i])
    }
  }
  return c.series.series(dates, values)
}

export function crossingDown(series1, series2, targetValues) {
  const dates = []
  const values = []
  for(let i=1; i<series1.length(); i++) {
    if (series1.range(i-1) >= series2.range(i-1) && series1.range(i) < series2.range(i)) {
      dates.push(series1.domain(i))
      values.push(targetValues[i])
    }
  }
  return c.series.series(dates, values)
}

export function getOHLCTooltip(ohlcSeries, i) {
  return `${new Date(ohlcSeries.domain(i)).toISOString()}<br/>` +
         `open: ${ohlcSeries.range(i)[0]}, high: ${ohlcSeries.range(i)[1]}<br/>` +
         `low: ${ohlcSeries.range(i)[2]}, close: ${ohlcSeries.range(i)[3]}`
}
