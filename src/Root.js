import * as d3 from 'd3'

import * as ou from './util/ObjectUtil'
import * as au from './util/ArrayUtil'
import * as sr from './util/Series'
import Label from './widget/Label'
import Box from './widget/Box'
import VBox from './widget/VBox'
import Chart from './widget/Chart'

import './default.css'

export default class Root extends Box {

  constructor(parentId) {
    super()
    this.parentId = parentId
    this.children = new VBox()
    this.class('jmc-root')
  }

  append(item) {
    this.children.append(item)
    if (ou.hasMethod(item, 'setRoot')) {
      item.setRoot(this)
    }
    return item
  }

  init() {

    const root = d3.select(`#${this.parentId}`)
      .style('width', `${this.width()}px`)
      .style('height', `${this.height()}px`)

    this.svg = root.append('svg')
      .attr('class', this.class())
      .attr('width', this.width())
      .attr('height', this.height())
      .style('position', 'absolute')

    this.div = root.append('div')
      .attr('class', this.class())
      .style('position', 'absolute')
      .style('width', `${this.width()}px`)
      .style('height', `${this.height()}px`)

    this.selectionMarker = this.div.append('div')
      .style('background', 'rgba(0, 0, 0, 0.5)')
      .style('position', 'absolute')
      .style('display', 'none')
      .style('z-index', 1)

    const dataPointsCount = Math.round(this.width() / 10)
    this._getMasterSeries().gotoEnd(dataPointsCount)

    this.layout = this._getLayout()
    this.children.init(this.svg, this.div, this.layout)
  }

  update() {
    this.updateStartTimestamp = new Date().getTime()
    this.layout = this._getLayout()
    this.children.update(this.layout)
  }

  _getLayout() {

    const layout = {}

    layout.totalWidth = this.width()
    layout.totalHeight = this.height()

    const masterSeries = this._getMasterSeries()
    const timeFrame = sr.getTimeFrame(masterSeries)
    layout.xDomainStart = masterSeries.sliceStart() - timeFrame
    layout.xDomainEnd = masterSeries.sliceEnd() + timeFrame

    layout.leftMargin = ou.max(
      this.children.items(),
      it => it.getLeftMargin(),
      it => it instanceof Chart)

    layout.rightMargin = ou.max(
      this.children.items(),
      it => it.getRightMargin(),
      it => it instanceof Chart)

    layout.contentWidth = this.width() - layout.leftMargin - layout.rightMargin

    return layout
  }

  _getMasterSeries() {
    for(let it of this.children.items()) {
      if (it instanceof Chart)  {
        return it.renderer(0).series
      }
    }
    return null
  }

  zoomStart() {
    this.zoomStartK = d3.event.transform.k
    this.zoomStartX = d3.event.transform.x
    this.mouseStart = d3.mouse(this.div.node())
  }

  zoomZoom() {
    const [x1, y1] = this.mouseStart
    const [x2, y2] = d3.mouse(this.div.node())
    if (d3.event.transform.k === this.zoomStartK && x1 != x2) {
      this.selectionMarker
        .style('display', 'block')
        .style('top', `${Math.min(y1, y2)}px`)
        .style('left', `${Math.min(x1, x2)}px`)
        .style('height', `${Math.max(5, Math.abs(y1-y2))}px`)
        .style('width', `${Math.abs(x1-x2)}px`)
    }
  }

  zoomEnd() {

    this.selectionMarker.style('display', 'none')

    const zoomEndK = d3.event.transform.k
    const zoomEndX = d3.event.transform.x

    if (zoomEndK > this.zoomStartK) {
      if (this._getMasterSeries().length() > 10) {
        this.zoom(0.66)
      }
    }
    else if (zoomEndK < this.zoomStartK) {
      this.zoom(1.5)
    }
    else if (this.zoomStartX !== zoomEndX) {
      this.zoomToSelection()
    }
  }

  zoomToSelection() {
    const x1 = this.mouseStart[0]
    const x2 = d3.mouse(this.div.node())[0]
    const relX1 = Math.max(0, (Math.min(x1,x2) - this.layout.leftMargin) / this.layout.contentWidth)
    const relX2 = Math.min(1, (Math.max(x1,x2) - this.layout.leftMargin) / this.layout.contentWidth)
    const domainSize = this.layout.xDomainEnd - this.layout.xDomainStart
    const d1 = this.layout.xDomainStart + domainSize * relX1
    const d2 = this.layout.xDomainStart + domainSize * relX2
    const i1 = this._getMasterSeries().indexGE(d1)
    const i2 = this._getMasterSeries().indexLE(d2)
    const dataPointsCountInSelection = i2 - i1 + 1
    if (dataPointsCountInSelection >= 2) {
      const dataChanged = this._getMasterSeries().gotoDomain(d1, d2)
      if (dataChanged) {
        this.update()
      }
    }
  }

  zoom(factor) {
    const dataChanged = this._getMasterSeries().zoom(factor)
    if (dataChanged) {
      this.update()
    }
  }

  scroll(factor) {
    const dataChanged = this._getMasterSeries().scroll(factor)
    if (dataChanged) {
      this.update()
    }
  }

  gotoRelStart(relStart) {
    const dataChanged = this._getMasterSeries().gotoRelStart(relStart)
    if (dataChanged) {
      this.update()
    }
  }

  updateContextInfo(source) {

    const info = this.children.items()
      .filter(it => ou.hasMethod(it, 'getContextInfo'))
      .map(it => it.getContextInfo())
      .reduce(
        (acc, info) => acc.concat(info),
        []
      )

    this.children.items()
      .filter(it => ou.hasMethod(it, 'updateContextInfo'))
      .forEach(it => it.updateContextInfo(source, info))
  }

  getVisibleDataWindow() {
    return this._getMasterSeries().getVisibleDataWindow()
  }
}
