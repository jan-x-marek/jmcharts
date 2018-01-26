import RendererBase from './RendererBase'

export default class LineRenderer extends RendererBase {

  render(ctx) {

    ctx.strokeStyle = this.color()
    ctx.lineWidth = this.lineWidth()

    ctx.beginPath()
    ctx.moveTo(
      rnd(this.x(this.series.domain(0))),
      rnd(this.y(this.series.range(0)))
    )
    for(let i=1; i<this.series.length(); i++) {
      ctx.lineTo(
        rnd(this.x(this.series.domain(i))),
        rnd(this.y(this.series.range(i)))
      )
    }
    ctx.stroke()
    ctx.closePath()
  }

  getContextInfo(x, y) {
    const [seriesIndex, canvasX, canvasY] = this.getClosestSeriesPoint(x, y)
    if (Math.abs(canvasX - x) <= 3 && Math.abs(canvasY - y) <= 3) {
      return this.collectContextInfo(seriesIndex)
    } else {
      return []
    }
  }
}

function rnd(x) {
  return Math.round(x)
}
