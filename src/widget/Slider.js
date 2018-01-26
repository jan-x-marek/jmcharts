import * as d3 from 'd3'
import * as lu from '../util/LangUtil'

export default class Slider {

  constructor(root, div) {

    this.root = root

    this.div = div
    div.attr('class', 'jmc-slider-main')
    div.on('click', () => this._largeScroll())

    this.arrowLeft = div.append('div')
      .text('<')
      .attr('class', 'jmc-slider-button')
      .style('float', 'left')
      .on('click', () => root.scroll(-0.2))

    this.arrowRight = div.append('div')
      .text('>')
      .attr('class', 'jmc-slider-button')
      .style('float', 'right')
      .on('click', () => root.scroll(0.2))

    this.thumb = div.append('div')
      .attr('class', 'jmc-slider-thumb')
      .call(d3.drag()
        .on('start', () => this._onDragStart())
        .on('drag', () => this._onDragDrag())
        .on('end', () => this._onDragEnd()))

    this.update()
  }

  update() {
    const [relStart, relWidth] = this.root.getVisibleDataWindow()
    const thumbWidth = Math.max(20, this.getTrackSize()*relWidth)
    const dataBeforeThumb = lu.round9(relStart)
    const dataAfterThumb = lu.round9(1 - relStart - relWidth)
    const relThumbLeft = dataBeforeThumb == 0 ?
      dataBeforeThumb :
      dataBeforeThumb / (dataBeforeThumb + dataAfterThumb)
    const thumbLeft = relThumbLeft * (this.getTrackSize() - thumbWidth)
    const adjustedThumbLeft = this.getTrackStart() + thumbLeft
    this.thumb
      .style('width', `${thumbWidth}px`)
      .style('left', `${adjustedThumbLeft}px`)
  }

  _onDragStart() {
    this.dragStartX = d3.event.x
    this.dragStartLeft = this.getThumbLeft()
  }

  _onDragDrag() {
    const move = d3.event.x - this.dragStartX
    const newLeft = lu.minmax(this.getTrackStart(), this.getMaxThumbLeft(), this.dragStartLeft+move)
    this.thumb.style('left', `${newLeft}px`)
  }

  _onDragEnd() {
    const [relStart, relWidth] = this.root.getVisibleDataWindow()
    const beforeThumb = this.getThumbLeft() - this.getTrackStart()
    const afterThumb = this.getTrackEnd() - this.getThumbLeft() - this.getThumbSize()
    const relBeforeThumb = beforeThumb / (beforeThumb + afterThumb)
    const newRelStart = (1 - relWidth) * relBeforeThumb
    this.root.gotoRelStart(newRelStart)
  }

  _largeScroll() {
    const x = d3.mouse(this.div.node())[0]
    if (x > this.getTrackStart() && x < this.getThumbLeft()) {
      this.root.scroll(-1)
    }
    if (x > this.getThumbLeft() + this.getThumbSize() && x < this.getTrackEnd()) {
      this.root.scroll(1)
    }
  }

  getMaxThumbLeft() {
    return this.getTrackEnd() - this.getThumbSize()
  }

  getThumbSize() {
    return width(this.thumb)
  }

  getThumbLeft() {
    return left(this.thumb)
  }

  getTrackStart() {
    return width(this.arrowLeft)
  }

  getTrackSize() {
    return width(this.div) - width(this.arrowLeft) - width(this.arrowRight)
  }

  getTrackEnd() {
    return this.getTrackStart() + this.getTrackSize()
  }
}

function left(d3Element) {
  return d3Element.node().offsetLeft
}

function width(d3Element) {
  return d3Element.node().offsetWidth
}
