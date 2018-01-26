import * as ou from '../util/ObjectUtil'
import Box from './Box'

export default class VBox extends Box {

  constructor() {
    super()
    ou.addFluentArray(this, '')
  }

  init(parentSvg, parentDiv, layout) {
    this.width(layout.totalWidth)
    this.height(layout.totalHeight)
    super.init(parentSvg, parentDiv, layout)
    this._computeCoordinates()
    this._initItems(layout)
  }

  _computeCoordinates() {
    let y = 0
    for(let item of this.items()) {
      item.x = 0
      item.y = y
      item.width(this.width())
      y += item.height()
    }
  }

  _initItems(layout) {
    this.items().forEach(it => it.init(this.svg, this.div, layout))
  }

  update(layout) {
    super.update(layout)
    this.items().forEach(it => it.update(layout))
  }
}
