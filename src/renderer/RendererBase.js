import * as d3 from 'd3'

import * as sr from '../util/Series'
import * as ou from '../util/ObjectUtil'
import * as cis from './ContextInfo'

export default class RendererBase {

  constructor(series) {
    this.fullSeries = series
    this.series = new sr.ZoomableSlice(series)
    ou.addFluentProperty(this, 'color', 'blue')
    ou.addFluentProperty(this, 'lineWidth', 2)
    ou.addFluentProperty(this, 'yAxis', 'y')
    ou.addFluentArray(this, 'contextInfoSupplier')
    this.x = d3.scaleLinear()
    this.y = d3.scaleLinear()
  }

  setDomain(start, end) {
    this.series.gotoDomain(start, end)
    this.x.domain([start, end])
  }

  setRange(start, end) {
    this.y.domain([start, end])
  }

  setSize(width, height) {
    this.x.range([0, width])
    this.y.range([height, 0])
  }

  getActualRange() {
    return [sr.min(this.series), sr.max(this.series)]
  }

  getContextInfo(x, y) {
    return []
  }

  addContextValueSupplier() {
    this.appendContextInfoSupplier(cis.plainSeriesValueSupplier(this.fullSeries))
    return this
  }
  
  addTooltipSupplier(supplier) {
    this.appendContextInfoSupplier(cis.tooltipSupplier(supplier))
    return this
  }

  getClosestSeriesPoint(x, y) {
    const domainX = this.x.invert(x)
    const closestIndex = sr.getClosestIndex(this.series, domainX)
    const closestXInSeries = this.series.domain(closestIndex)
    const closestXOnCanvas = this.x(closestXInSeries)
    const closestYInSeries = this.series.range(closestIndex)
    const closestYOnCanvas = this.y(closestYInSeries)
    return [closestIndex, closestXOnCanvas, closestYOnCanvas]
  }

  collectContextInfo(seriesIndex) {
    return this.contextInfoSuppliers().reduce(
      (acc, supplier) => {
        const fullSeriesIndex = this.fullSeries.indexLE(this.series.domain(seriesIndex))
        const newItem = {
          topic : supplier.topic,
          value : supplier(fullSeriesIndex)
        }
        acc.push(newItem)
        return acc
      },
      []
    )
  }
}
