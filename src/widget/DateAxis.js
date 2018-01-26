import * as d3 from 'd3'

import * as ou from '../util/ObjectUtil'
import Box from './Box'
import Chart from './Chart'

export default class DateAxis extends Box {

  constructor() {
    super()
    this.height(20)
    this.xScale = d3.scaleLinear()
    this.dateFormat = d3.timeFormat('%y/%m/%d %H:%M')
  }

  setRoot(root) {
    this.root = root
  }

  init(parentSvg, parentDiv, layout) {

    super.init(parentSvg, parentDiv, layout)

    this.xAxis = d3.axisBottom()
      .scale(this.xScale)
      .tickSizeOuter(0)
      .tickFormat(this.dateFormat)

    this.svg.call(this.xAxis)
  }

  update(layout) {

    super.update(layout)

    this.xScale.domain([layout.xDomainStart, layout.xDomainEnd])

    this.xScale.range([layout.leftMargin, layout.leftMargin + layout.contentWidth])

    const topChartY = ou.min(
      this.root.children.items(),
      it => it.y,
      it => it instanceof Chart)

    this.xAxis
      .ticks(layout.contentWidth / 150)
      .tickSizeInner(topChartY - this.y)

    this.svg.call(this.xAxis)
  }

  getContextInfo() {
    const [mx, my] = d3.mouse(this.svg.node())
    const dateStr = new Date(this.xScale.invert(mx)).toISOString().slice(0, -8)
    return [{topic: 'currentValue', value: {date: dateStr}}]
  }
}
