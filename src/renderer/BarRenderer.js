import RendererBase from './RendererBase'

export default class BarRenderer extends RendererBase {

  render(ctx) {

    ctx.fillStyle = this.color()
    const lineWidth = this.lineWidth()

    for(let i=0; i<this.series.length(); i++) {
      const barX = rnd(this.x(this.series.domain(i))) - 1
      const barY = rnd(this.y(this.series.range(i)))
      ctx.fillRect(barX, barY, lineWidth, this.y.range()[0]-barY)
    }
  }

  getContextInfo(x, y) {
    const [seriesIndex, canvasX, canvasY] = this.getClosestSeriesPoint(x, y)
    if (Math.abs(canvasX - x) <= 3 && y >= 0) {
      return this.collectContextInfo(seriesIndex)
    } else {
      return []
    }
  }
}

function rnd(x) {
  return Math.round(x)
}
