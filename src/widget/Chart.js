import * as d3 from 'd3'

import * as au from '../util/ArrayUtil'
import * as ou from '../util/ObjectUtil'
import Box from './Box'

//TODO Calculate the width dynamically.
const Y_AXIS_WIDTH = 40

export default class Chart extends Box {

  constructor() {
    super()
    ou.addFluentArray(this, 'renderer')
  }

  setRoot(root) {
    this.root = root
  }

  getLeftMargin() {
    return Y_AXIS_WIDTH
  }

  getRightMargin() {
    return (this.getAxesCount() - 1) * Y_AXIS_WIDTH
  }

  getAxesCount() {
    return new Set(this.renderers().map(r => r.yAxis())).size
  }

  init(parentSvg, parentDiv, layout) {
    super.init(parentSvg, parentDiv, layout)
    this._initAxes(layout)
    this._initCanvas(layout)
  }

  update(layout) {
    super.update(layout)
    this._updateAxes(layout)
    this._updateCanvas(layout)
  }

  _initAxes(layout) {

    this.axes = {}

    this.renderers().forEach(r => {
      const axId = r.yAxis()
      if (this.axes[axId] === undefined) {
        this.axes[axId] = {
          'id': axId,
          'primary': Object.keys(this.axes).length === 0,
          'min': Number.POSITIVE_INFINITY,
          'max': Number.NEGATIVE_INFINITY
        }
      }
    })

    Object.values(this.axes).forEach(ax => {

      ax.scale = d3.scaleLinear()

      if (ax.primary) {

        ax.axis = d3.axisLeft()
          .scale(ax.scale)
          .tickSizeOuter(0)

        ax.g = this.svg.append('g')
          .attr('class', 'yAxis')
          .call(ax.axis)

      } else {

        ax.axis = d3.axisRight()
          .scale(ax.scale)
          .tickSize(0)

        ax.g = this.svg.append('g')
          .attr('class', 'yAxis')
          .call(ax.axis)
      }
    })
  }

  _updateAxes(layout) {

    Object.values(this.axes).forEach(ax => {
      ax.min = Number.POSITIVE_INFINITY
      ax.max =  Number.NEGATIVE_INFINITY
    })

    this.renderers().forEach(r => {
      const axId = r.yAxis()
      const ax = this.axes[axId]
      r.setDomain(layout.xDomainStart, layout.xDomainEnd)
      const [low,high] = r.getActualRange()
      ax.min = Math.min(low, ax.min)
      ax.max = Math.max(high, ax.max)
    })

    let secondaryAxesCount = 0
    Object.values(this.axes).forEach(ax => {

      const padding = (ax.max - ax.min) * 0.05
      ax.min -= padding
      ax.max += padding

      ax.scale
        .domain([ax.min, ax.max])
        .range([this.height(), 0])

      if (ax.primary) {

        ax.axis
          .ticks(this.height() / 30)
          .tickSizeInner(-layout.contentWidth)

        ax.g
          .attr('transform', `translate(${layout.leftMargin}, 0)`)
          .call(ax.axis)

      } else {

        ax.axis
          .ticks(this.height() / 30)

        const xTranslate = layout.leftMargin + layout.contentWidth +
          secondaryAxesCount * (Y_AXIS_WIDTH + 5)

        ax.g
          .attr('transform', `translate(${xTranslate}, 0)`)
          .call(ax.axis)

        secondaryAxesCount++
      }
    })
  }

  _initCanvas(layout) {

    this.canvas = this.div.append('canvas')
      .attr('width', `${layout.contentWidth}px`)
      .attr('height', `${this.height()}px`)
      .style('position', 'absolute')
      .style('left', `${layout.leftMargin}px`)
      .style('cursor', 'crosshair')
      .style('border-top', '1px solid black')
      .style('border-right', '1px solid black')
      .on('mousemove', () => this.root.updateContextInfo(this))
      .on('mouseout', () => this.root.updateContextInfo(this))
      .call(d3.zoom()
        .on('start', () => this.root.zoomStart())
        .on('zoom', () => this.root.zoomZoom())
        .on('end', () => this.root.zoomEnd()))
      .node()

    this.ctx = this.canvas.getContext('2d')
  }

  _updateCanvas(layout) {

    this.ctx.beginPath()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.closePath()

    //Reverse because we want the first series to be drawn on the top.
    this.renderers().slice(0).reverse().forEach(r => {
      const ax = this.axes[r.yAxis()]
      r.setRange(ax.min, ax.max)
      r.setSize(layout.contentWidth, this.height())
      r.render(this.ctx)
    })
  }

  getContextInfo() {
    const [mx, my] = d3.mouse(this.canvas)
    const info = this.renderers()
      .map(r => r.getContextInfo(mx, my))
      .reduce(
        (acc, info) => acc.concat(info),
        []
      )
    return info
  }
}
