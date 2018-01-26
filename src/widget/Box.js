import * as ou from '../util/ObjectUtil'

export default class Box {

  constructor() {
    ou.addFluentProperty(this, 'width', 0)
    ou.addFluentProperty(this, 'height', 0)
    ou.addFluentProperty(this, 'class', '')
    this.x = 0
    this.y = 0
  }

  init(parentSvg, parentDiv, layout) {

    this.svg = parentSvg.append('g')
      .attr('transform', `translate(${this.x}, ${this.y})`)
      .attr('class', this.class())

    this.div = parentDiv.append('div')
      .attr('class', this.class())
      .style('position', 'absolute')
      .style('left', `${this.x}px`)
      .style('top', `${this.y}px`)
      .style('width', `${this.width()}px`)
      .style('height', `${this.height()}px`)
  }

  update(layout) {}
}
