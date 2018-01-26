import * as d3 from 'd3'
import Box from './Box'

export default class Tooltip extends Box {

  setRoot(root) {
    this.root = root
  }

  init(parentSvg, parentDiv, layout) {

    super.init(parentSvg, parentDiv, layout)

    this.tooltip = this.root.div.append('div')
      .attr('class', 'jmc-tooltip')
      .style('display', 'none')
  }

  updateContextInfo(source, info) {

    const tooltips = info
      .filter(o => o.topic === 'tooltip')
      .map(o => o.value)

    if (tooltips.length === 0) {
      this.tooltip
        .html('')
        .style('display', 'none')
    }
    else {
      const [mx, my] = d3.mouse(source.canvas)
      const html = tooltips.join('<br/>')
      this.tooltip
        .html(html)
        .style('display', 'block')
        .style('z-index', 1)
        .style('position', 'absolute')
        .style('left', `${mx + this.root.layout.leftMargin + 10}px`)
        .style('top', `${my + source.y}px`)
    }
  }
}
