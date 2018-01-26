import {jmcharts as c} from '../../src/index'
import * as dh from './DataHelper'

const r = c.renderer
const w = c.widget
const s = c.series

const data = dh.generateOHLCV(50000)

const root = c.root('chart')
  .width(600)
  .height(500)

root.append(w.label())
  .text('JMCharts demo - SnakeOilCoin prices')
  .class('jmc-header-2')
  .height(25)
  .paddingBottom(10)

const ohlcChart = root.append(w.chart()).height(300)

const ohlcSeries = s.ohlcSeries(data.time, data.open, data.high, data.low, data.close)
ohlcChart.appendRenderer(r.ohlc(ohlcSeries))
  .color('blue')
  .addContextValueSupplier()
  .addTooltipSupplier(i => dh.getOHLCTooltip(ohlcSeries, i))

const movingAvg1 = dh.movingAverage(s.series(data.time, data.close), 5).name('MA5')
ohlcChart.appendRenderer(r.line(movingAvg1))
  .color('red')
  .addContextValueSupplier()

const movingAvg2 = dh.movingAverage(s.series(data.time, data.close), 20).name('MA20')
ohlcChart.appendRenderer(r.line(movingAvg2))
  .color('grey')
  .addContextValueSupplier()

const crossingUp = dh.crossingUp(movingAvg1, movingAvg2, data.low)
ohlcChart.appendRenderer(r.shape(crossingUp))
  .color('#999')
  .shape(r.shapes.equilateralTriangleUp(20))
  .fill(true)
  .addTooltipSupplier(i => `<h2>Buy SnakeOil here!</h2>`)

const crossingDown = dh.crossingDown(movingAvg1, movingAvg2, data.high)
ohlcChart.appendRenderer(r.shape(crossingDown))
  .color('#999')
  .shape(r.shapes.equilateralTriangleDown(20))
  .fill(true)
  .addTooltipSupplier(i => `<h2>Sell SnakeOil here!</h2>`)

root.append(w.chart())
  .height(100)
  .appendRenderer(r.bar(s.series(data.time, data.vol).name('vol')))
  .addContextValueSupplier()

root.append(w.dateAxis())
root.append(w.controlPanel())
root.append(w.profiler().height(15))
root.append(w.currentValues().height(15))
root.append(w.tooltip())

root.init()
root.update()
