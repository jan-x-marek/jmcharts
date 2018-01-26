import * as ou from '../util/ObjectUtil'
import * as sr from '../util/Series'
import RendererBase from './RendererBase'
import {diamond} from './Shapes'

export default class ShapeRenderer extends RendererBase {

  constructor(series) {
    super(series)
    ou.addFluentProperty(this, 'fill', false)
    ou.addFluentProperty(this, 'shape', diamond(10))
  }

  render(ctx) {

    const fill = this.fill()
    const shape = this.shape()

    ctx.fillStyle = this.color()
    ctx.strokeStyle = this.color()
    ctx.lineWidth = this.lineWidth()

    for(let i=0; i<this.series.length(); i++) {

      const x = rnd(this.x(this.series.domain(i)))
      const y = rnd(this.y(this.series.range(i)))

      ctx.beginPath()
      shape(ctx, x, y)
      ctx.stroke()
      if (fill) {
        ctx.fill()
      }
      ctx.closePath()
    }
  }

  getContextInfo(x, y) {
    const [seriesIndex, canvasX, canvasY] = this.getClosestSeriesPoint(x, y)
    if (this.shape().contains(canvasX - x, canvasY - y)) {
      return this.collectContextInfo(seriesIndex)
    } else {
      return []
    }
  }
}

function rnd(x) {
  return Math.round(x)
}
