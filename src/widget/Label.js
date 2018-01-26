import * as ou from '../util/ObjectUtil'
import Box from './Box'

export default class Label extends Box {

  constructor() {
    super()
    ou.addFluentProperty(this, 'text', '')
    ou.addFluentProperty(this, 'paddingLeft', 5)
    ou.addFluentProperty(this, 'paddingBottom', 5)
  }

  init(parentSvg, parentDiv, layout) {
    super.init(parentSvg, parentDiv, layout)
    this.textSVG = this.svg.append('text')
      .attr('x', this.paddingLeft())
      .attr('y', this.height() - this.paddingBottom())
  }

  update(layout) {
    this.textSVG.text(this.text())
  }
}
