import * as lu from '../util/LangUtil'

//f takes an index and returns an object (whose structure is topic-dependent)
export function contextInfoSupplier(topic, f) {
  f.topic = topic
  return f
}

export function plainSeriesValueSupplier(series) {
  return contextInfoSupplier(
    'currentValue',
    i => {
      const value = series.range(i)
      const roundValue = lu.isNumber(value) ? lu.round6(value) : value
      return {[series.name()] : roundValue}
    }
  )
}

export function ohlcSeriesValueSupplier(series) {
  return contextInfoSupplier(
    'currentValue',
    i => {
      const ohlc = series.range(i)
      const prefix = series.name().length == 0 ? '' : series.name()+'/'
      return {[prefix+'open']: ohlc[0], high: ohlc[1], low: ohlc[2], close: ohlc[3]}
    }
  )
}

export function tooltipSupplier(f) {
  return contextInfoSupplier('tooltip', f)
}

export const exports = {
  contextInfoSupplier: contextInfoSupplier,
  plainSeriesValueSupplier: plainSeriesValueSupplier,
  ohlcSeriesValueSupplier: ohlcSeriesValueSupplier,
  tooltipSupplier: tooltipSupplier
}
