import * as d3 from 'd3'

import * as sr from '../util/Series'
import * as cis from './ContextInfo'
import RendererBase from './RendererBase'

const DATE_FORMAT = d3.timeFormat('%y/%m/%d %H:%M');

export default class OhlcRenderer extends RendererBase {

  render(ctx) {

    const lineWidth = this.lineWidth()

    ctx.strokeStyle = this.color()
    ctx.lineWidth = lineWidth

    for(let i=0; i<this.series.length(); i++) {

      const bx = rnd(this.x(this.series.domain(i)))

      const bar = this.series.range(i)
      const bo = rnd(this.y(bar[0]))
      const bh = rnd(this.y(bar[1]))
      const bl = rnd(this.y(bar[2]))
      const bc = rnd(this.y(bar[3]))

      ctx.beginPath()
      ctx.moveTo(bx, bh)
      ctx.lineTo(bx, bl)
      ctx.stroke()
      ctx.closePath()
      
      ctx.beginPath()
      ctx.moveTo(bx+lineWidth*0.5, bo)
      ctx.lineTo(bx-lineWidth*1.5, bo)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.moveTo(bx-lineWidth*0.5, bc)
      ctx.lineTo(bx+lineWidth*1.5, bc)
      ctx.stroke()
      ctx.closePath()
    }
  }
  
  getActualRange() {
    const min = sr.min(this.series, bar => bar[2])
    const max = sr.max(this.series, bar => bar[1])
    return [min, max]
  }

  addContextValueSupplier() {
    this.appendContextInfoSupplier(cis.ohlcSeriesValueSupplier(this.fullSeries))
    return this
  }
  
  getContextInfo(x, y) {

    const domainX = this.x.invert(x)
    const closestIndex = sr.getClosestIndex(this.series, domainX)
    const closestXInSeries = this.series.domain(closestIndex)
    const closestXOnCanvas = this.x(closestXInSeries)
    if (Math.abs(x - closestXOnCanvas) > 5) {
      return []
    }

    const ohlc = this.series.range(closestIndex)
    const highOnCanvas = this.y(ohlc[2])
    const lowOnCanvas = this.y(ohlc[1])

    if (y < lowOnCanvas - 1 || y > highOnCanvas + 1) {
      return []
    } else {
      return this.collectContextInfo(closestIndex)
    }
  }
}

function rnd(x) {
  return Math.round(x)
}
