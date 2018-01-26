import {jmcharts as c} from '../../src/index'
import * as dh from './DataHelper'
import './custom.css'

const r = c.renderer
const w = c.widget
const s = c.series

createChart('chart', dh.generateOHLCV(50000))

function createChart(elementId, data) {

  const root = c.root(elementId)
    .width(700)
    .height(550)

  root.append(w.label())
    .text('JMCharts Demo')
    .class('jmc-header-1')
    .height(30)
    .paddingBottom(10)

  const ohlcChart = root.append(w.chart())
    .height(300)

  const ohlcSeries = s.ohlcSeries(data.time, data.open, data.high, data.low, data.close)
  ohlcChart.appendRenderer(r.ohlc(ohlcSeries))
    .color('blue')
    .addContextValueSupplier()
    .addTooltipSupplier(i => `<h3>tooltip ${i}</h3> lorem ipsum`)

  const lineSeries1 = distortDomain(prune(ohlcSeries.mapRange(x => x[2]), 0.2), 0).name('shape')
  ohlcChart.appendRenderer(r.shape(lineSeries1))
    .color('#777')
    .shape(r.shapes.equilateralTriangleDown(20))
    .lineWidth(2)
    .fill(false)
    .addContextValueSupplier()
    .addTooltipSupplier(i => `<h2>tooltip ${i}</h2> sfgsdgsdfg sdfg sdg s <br/> asfasdf asf af`)

  const lineSeries2 = ohlcSeries.mapRange(x => Math.sin(x[3]/1000)).name('s2')
  ohlcChart.appendRenderer(r.line(lineSeries2))
    .color('red')
    .yAxis('y2')
    .addContextValueSupplier()

  const lineSeries3 = ohlcSeries.mapRange(x => Math.tan(x[3]/10)).name('s3')
  ohlcChart.appendRenderer(r.line(lineSeries3))
    .color('green')
    .yAxis('y3')
    .addContextValueSupplier()

  //ohlcChart.appendRenderer(r.line(s.series([], [])))

  //ohlcChart.appendRenderer(r.line(s.series([], [])))
  //  .yAxis('y4')

  root.append(w.chart())
    .height(100)
    .appendRenderer(r.bar(s.series(data.time, data.vol).name('vol')))
    .addContextValueSupplier()

  //root.append(w.chart())
  //  .height(20)
  //  .appendRenderer(r.line(s.series([], [])))

  root.append(w.dateAxis())
  root.append(w.controlPanel())
  root.append(w.currentValues())
  root.append(w.tooltip())
  root.append(w.profiler())

  root.init()
  root.update()
}

function prune(series, p) {
  const newDomain = []
  const newRange = []
  for(let i=0; i<series.length(); i++) {
    if (Math.random() < p) {
      newDomain.push(series.domain(i))
      newRange.push(series.range(i))
    }
  }
  return s.series(newDomain, newRange)
}

function distortDomain(series, d) {
  const newDomain = []
  const newRange = []
  for(let i=0; i<series.length(); i++) {
    newDomain.push(Math.round(series.domain(i) + d * Math.random()))
    newRange.push(series.range(i))
  }
  return s.series(newDomain, newRange)
}
